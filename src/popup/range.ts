import { fromEvent, Stream } from "most";

export const rangeEl = document.getElementById("level") as HTMLInputElement;

export const range$ = fromEvent("input", rangeEl)
  .map(ev => (ev.target as HTMLInputElement).valueAsNumber)
  .startWith(0);

const valueEl = document.getElementById("levelValue");
export const rangeIO = (range$: Stream<number>) =>
  range$.map(value => () => {
    const text = value > 9000 ? "it's over 9000!" : value.toString();
    valueEl.innerText = text;
    rangeEl.valueAsNumber = value;
  });
