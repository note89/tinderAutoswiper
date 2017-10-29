import { fromEvent, Stream } from "most";
export const playPauseBtn = document.getElementById("playPause");

export const toggle$ = fromEvent("click", playPauseBtn);

export const playPauseBtnIO = (playing$: Stream<boolean>) =>
  playing$.map(playing => () => {
    playing
      ? (playPauseBtn.innerText = "Stop Swiping")
      : (playPauseBtn.innerText = "Start Swiping");
  });
