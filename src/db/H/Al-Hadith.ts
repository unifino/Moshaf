import * as TS                          from "@/../types/myTypes"

const k = require( "@/../../db/H/الكافي.json" ) as TS.HDB;
const v = require( "@/../../db/H/وسائل‌الشيعة.json" ) as TS.HDB;
const n = require( "@/../../db/H/نهج‌البلاغة.json" ) as TS.HDB;
const f = require( "@/../../db/H/نهج‌الفصاحة.json" ) as TS.HDB;
const m = require( "@/../../db/H/مستدرك‌الوسائل.json" ) as TS.HDB;
const z = require( "@/../../db/H/keep.json" ) as TS.HDB;
const a = require( "@/../../db/H/more.json" ) as TS.HDB;


// const a = require( "@/../../db/H/hadith.json" ) as TS.HDB;
// nHadith = a;


// .. temporary collection
let nHadith: TS.hadithCell[] = [];
// .. create db based on N
for ( let p of [ ...k,...v,...n, ...f, ...m, ...z, ...a ] ) nHadith[ p.n ] = p;

// .. register it
export let Hadith = nHadith;