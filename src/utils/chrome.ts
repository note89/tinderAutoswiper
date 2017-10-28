import { fromPromise, Stream } from "most";
import { async } from "most-subject";

export const query = (queryInfo: chrome.tabs.QueryInfo) => 
    fromPromise(new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
        chrome.tabs.query(queryInfo, resolve);
    }))


export const sendMessage = (id: number) => (payload: any) =>
    fromPromise(new Promise<any>((resolve, reject) => {
        chrome.tabs.sendMessage(id, payload, resolve)
    }))



const onMessageSubject = async<{payload: number}>();
export const onMessage$ = new Stream(onMessageSubject.source)

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      onMessageSubject.next(request)
  });
