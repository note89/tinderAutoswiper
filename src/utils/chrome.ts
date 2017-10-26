import { fromPromise } from "most";

export const query = (queryInfo: chrome.tabs.QueryInfo) => 
    fromPromise(new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
        chrome.tabs.query(queryInfo, resolve);
    }))


export const sendMessage = (id: number) => (payload: any) =>
    fromPromise(new Promise<any>((resolve, reject) => {
        chrome.tabs.sendMessage(id, payload, resolve)
    }))
