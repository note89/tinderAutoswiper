import { query , sendMessage } from "./utils/chrome";
import { just, combine, fromEvent } from "most"

const queryIO$ = query({active: true, currentWindow: true})
const currentTabId$ = queryIO$.map(tabs => tabs[0].id)
const sendToCurrentTab$ = currentTabId$.map(id => sendMessage(id))

const io$ =
    just({greeting: "hello"}).
    combine((payload, endpoint) => endpoint(payload), sendToCurrentTab$)
    .switch()


const rangeValue$ = fromEvent("input", document.getElementById("level"))
                    .map(ev => (ev.target as HTMLInputElement).value)

rangeValue$.observe(console.log)

const valueDiv = document.getElementById("levelValue")
rangeValue$.observe(value => {
    valueDiv.innerText = value;
})
io$.drain()
