import * as TS                          from "@/../types/myTypes"

const k = require( "./الكافي.json" ) as TS.HDB;
const v = require( "./وسائل‌الشيعة.json" ) as TS.HDB;
const n = require( "./نهج‌البلاغة.json" ) as TS.HDB;
const z = require( "./نهاية.json" ) as TS.HDB;

// .. temporary collection
let nHadith: TS.hadithCell[] = [];
// .. create db based on N
for ( let p of [ ...k,...v,...n,...z ] ) nHadith[ p.n ] = p;
// .. register it
export const Hadith = nHadith;
