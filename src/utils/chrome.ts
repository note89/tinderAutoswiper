import { fromPromise, Stream } from "most";
import { async } from "most-subject";

export const query = (queryInfo: chrome.tabs.QueryInfo) =>
  fromPromise(
    new Promise<chrome.tabs.Tab[]>(resolve => {
      chrome.tabs.query(queryInfo, resolve);
    })
  );

export const sendMessage = (id: number) => (msg: { payload: Payload }) =>
  fromPromise(
    new Promise<any>(resolve => {
      chrome.tabs.sendMessage(id, msg, resolve);
    })
  );

const onMessageSubject = async<{ payload: Payload }>();
export const onMessage$ = new Stream(onMessageSubject.source).multicast();
chrome.runtime.onMessage.addListener(function(request) {
  onMessageSubject.next(request);
});

const onConnectSubject = async<chrome.runtime.Port>();
export const onConnect$ = new Stream(onConnectSubject.source).multicast();
chrome.runtime.onConnect.addListener(port => onConnectSubject.next(port));

export const onDisconnect = (onConnect$: Stream<chrome.runtime.Port>) =>
  onConnect$
    .map(port => {
      return fromPromise(
        new Promise<chrome.runtime.Port>(resolve => {
          port.onDisconnect.addListener(resolve);
        })
      );
    })
    .switch();

export const onPortMessage = (port$: Stream<chrome.runtime.Port>) =>
  port$
    .map(port => {
      const portMessageSubject = async<{ payload: Payload }>();
      const message$ = new Stream(portMessageSubject.source);
      port.onMessage.addListener((x: { payload: Payload }) =>
        portMessageSubject.next(x)
      );
      return message$;
    })
    .switch();

export const getFromStore = (key: string) =>
  fromPromise(
    new Promise(resolve => {
      chrome.storage.local.get(key, resolve);
    })
  );
