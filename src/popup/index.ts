import { getFromStore } from "../utils/chrome";
import { Stream, mergeArray, just } from "most";
import { sendToCurrentTab$, notTinderTab$ } from "./query";
import { range$, rangeIO } from "./range";
import { toggle$, playPauseBtnIO } from "./playPauseBtn";

/* Look for old Data */
const readFromStore$ = (getFromStore("data") as Stream<{
  data?: { playing: boolean; value: number };
}>)
  .filter(x => typeof x.data !== "undefined")
  .map(x => x.data);

const rangeValue$ = range$.merge(readFromStore$.map(x => x.value));

const playing$ = just(false)
  .merge(readFromStore$.map(x => x.playing))
  .map(b => toggle$.scan(acc => !acc, b))
  .switch();

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
const playPauseButtonIO$ = playPauseBtnIO(playing$);
const rangeIO$ = rangeIO(rangeValue$);

const notTinderIO$ = notTinderTab$.map(notTinder => () => {
  const notTinderEl = document.getElementById("notTinderContainer");
  const tinderEl = document.getElementById("tinderContainer");
  notTinder ? (notTinderEl.className = "show") : (tinderEl.className = "show");
});

const storeIO$ = playing$.combine(
  (playing, value) => () =>
    chrome.storage.local.set({ data: { playing, value } }),
  rangeValue$
);

const io$: Stream<() => void> = mergeArray([
  playPauseButtonIO$,
  rangeIO$,
  notTinderIO$,
  storeIO$,
  rangeIO$
]);

io$.observe(x => x());
