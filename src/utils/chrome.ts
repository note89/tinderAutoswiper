import { fromPromise, Stream } from "most";
import { async } from "most-subject";

export const query = (queryInfo: chrome.tabs.QueryInfo) =>
  fromPromise(
    new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
      chrome.tabs.query(queryInfo, resolve);
    })
  );

export const sendMessage = (id: number) => (msg: { payload: Payload }) =>
  fromPromise(
    new Promise<any>((resolve, reject) => {
      chrome.tabs.sendMessage(id, msg, resolve);
    })
  );

const onMessageSubject = async<{ payload: Payload }>();
export const onMessage$ = new Stream(onMessageSubject.source).multicast();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  onMessageSubject.next(request);
});
