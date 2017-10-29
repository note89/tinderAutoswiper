import { query, sendMessage } from "../utils/chrome";

const queryIO$ = query({ active: true, currentWindow: true });
const currentTabId$ = queryIO$.map(tabs => tabs[0].id);
export const sendToCurrentTab$ = currentTabId$.map(id => sendMessage(id));

export const notTinderTab$ = queryIO$.map(
  x => x[0].url.indexOf("https://tinder.com") < 0
);
