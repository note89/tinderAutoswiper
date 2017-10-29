import { iterate, empty } from "most";

import { onMessage$ } from "../utils/chrome";
import { ratio2Range } from "../utils/ratio2Range";
import { delay } from "../utils/delay";

/* Utils */
const ratio2Frequency = ratio2Range(4000)(100);

/* Messages from popup */
const frequency$ = onMessage$.map(x => ratio2Frequency(x.payload.value));
const playing$ = onMessage$.map(x => x.payload.play);

/* When to Click */
const click$ = frequency$
  .combine(
    (freq, playing) =>
      playing ? iterate(() => delay(freq), freq).skip(1) : empty(),
    playing$
  )
  .switch()
  .merge(playing$.skipRepeats().filter(x => x));

/* The Like button element */
const getLikeBtn = () =>
  document.querySelector('button[aria-label="Like"]') as HTMLElement;

/* IO */
const clickIO$ = click$.constant(() => getLikeBtn().click());

/* Run */
clickIO$.observe(x => x());
