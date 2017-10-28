import { query , sendMessage } from "./utils/chrome";
import { just, combine, fromEvent } from "most"

const rangeValue$ = fromEvent("input", document.getElementById("level"))
                    .map(ev => (ev.target as HTMLInputElement).valueAsNumber)

const valueDiv = document.getElementById("levelValue")
rangeValue$.observe(value => {
    valueDiv.innerText = value.toString();
})



const queryIO$ = query({active: true, currentWindow: true})
const currentTabId$ = queryIO$.map(tabs => tabs[0].id)
const sendToCurrentTab$ = currentTabId$.map(id => sendMessage(id))

const io$ =
    rangeValue$.map((value) => ({payload: (value/9001) })). //Knowleadge at the wrong place. 
    combine((payload, endpoint) => endpoint(payload), sendToCurrentTab$)
    .debounce(100)
    .switch()


io$.drain()

