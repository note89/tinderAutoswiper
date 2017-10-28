import { query , sendMessage } from "./utils/chrome";
import { just, Stream, combine, scan, fromEvent, mergeArray } from "most"

const rangeValue$ = fromEvent("input", document.getElementById("level"))
    .map(ev => (ev.target as HTMLInputElement).valueAsNumber)
    .startWith(0)

const valueDiv = document.getElementById("levelValue")
const queryIO$ = query({active: true, currentWindow: true})
const currentTabId$ = queryIO$.map(tabs => tabs[0].id)
const sendToCurrentTab$ = currentTabId$.map(id => sendMessage(id))

const playPauseBtn = document.getElementById("playPause")

const toggle$ = fromEvent("click", playPauseBtn)

const playing$ = toggle$.scan((acc) => !acc, false)

const sendMessage$ =
    rangeValue$.combine((value, playing) => ({payload: {value: (value/9001) , play: playing}}), playing$). //Knowleadge at the wrong place. 
    combine((payload, endpoint) => endpoint(payload), sendToCurrentTab$)
    .debounce(100)
    .switch()
    .drain()



/* IO */
const playPauseButtonIO$ = playing$.map(playing => () => playing ? playPauseBtn.innerText = "Stop Swiping" : playPauseBtn.innerText = "Start Swiping")
const currentLevelIO$ = rangeValue$.map(value => () => {
    const text = value > 9000 ? "it's over 9000!" : value.toString()
    valueDiv.innerText = text
})

const io$: Stream<() => void> = mergeArray([
    playPauseButtonIO$,
    currentLevelIO$,
])

io$.observe(x => x())

