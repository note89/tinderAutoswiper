import { query, sendMessage, getFromStore } from "./utils/chrome";
import { Stream, fromEvent, mergeArray, just } from "most";

const readFromStore$ = (getFromStore("data") as Stream<{
  data?: { playing: boolean; value: number };
}>)
  .filter(x => typeof x.data !== "undefined")
  .map(x => x.data);

const rangeValue$ = fromEvent("input", document.getElementById("level"))
  .map(ev => (ev.target as HTMLInputElement).valueAsNumber)
  .startWith(0)
  .merge(readFromStore$.map(x => x.value));

const valueDiv = document.getElementById("levelValue");
const rangeEl = document.getElementById("level") as HTMLInputElement;
const queryIO$ = query({ active: true, currentWindow: true });
const currentTabId$ = queryIO$.map(tabs => tabs[0].id);
const sendToCurrentTab$ = currentTabId$.map(id => sendMessage(id));

const playPauseBtn = document.getElementById("playPause");

const toggle$ = fromEvent("click", playPauseBtn);

//const playing$ = toggle$.scan(acc => !acc, false).merge(readFromStore$.map(x => x.playing))
const playing$ = just(false)
  .merge(readFromStore$.map(x => x.playing))
  .map(b => toggle$.scan(acc => !acc, b))
  .switch();
playing$.observe(console.log);

const msg$ = rangeValue$.combine(
  (value, playing) => ({ payload: { value: value / 9001, play: playing } }),
  playing$
);

const sendMessage$ = msg$
  .combine((payload, endpoint) => endpoint(payload), sendToCurrentTab$)
  .debounce(100)
  .switch();

sendMessage$.drain();

/* IO */
const playPauseButtonIO$ = playing$.map(playing => () =>
  playing
    ? (playPauseBtn.innerText = "Stop Swiping")
    : (playPauseBtn.innerText = "Start Swiping")
);
const currentLevelIO$ = rangeValue$.map(value => () => {
  const text = value > 9000 ? "it's over 9000!" : value.toString();
  valueDiv.innerText = text;
});

const notTinderUrl$ = queryIO$.map(x => x[0].url.indexOf("tinder") < 0);
const notTinderIO$ = notTinderUrl$.map(notTinder => () => {
  const notTinderEl = document.getElementById("notTinderContainer");
  const tinderEl = document.getElementById("tinderContainer");
  notTinder ? (notTinderEl.className = "show") : (tinderEl.className = "show");
});

const storeIO$ = playing$.combine(
  (playing, value) => () =>
    chrome.storage.local.set({ data: { playing, value } }),
  rangeValue$
);
const rangeIO$ = readFromStore$.map(x => () =>
  (rangeEl.valueAsNumber = x.value)
);

const io$: Stream<() => void> = mergeArray([
  playPauseButtonIO$,
  currentLevelIO$,
  notTinderIO$,
  storeIO$,
  rangeIO$
]);

io$.observe(x => x());
