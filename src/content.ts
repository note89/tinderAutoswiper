import { onMessage$ } from "./utils/chrome";
import { combine, iterate, just } from "most";

const getLike =  () => document.querySelector('button[aria-label="Like"]') as HTMLElement

const getFrequeny = (max: number) => (min: number) => (ratio: number) =>
    Math.floor(min*(1 - ratio) + max*ratio)

const defaultFreq = getFrequeny(250)(2000)

const frequency$ = onMessage$.map(x => defaultFreq(x.payload))
frequency$.observe(console.log)

const delay = (y: number) =>
	  new Promise(resolve => setTimeout(resolve, y))

const click$ = frequency$.map( freq => iterate(() => delay(freq), freq).skip(1)).switch()

const clickIO$ = click$.constant(() => getLike().click())

clickIO$.observe(x => x())
