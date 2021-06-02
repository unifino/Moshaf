type db = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,

    aF?: string,    // a in farsiLetters
    bF?: string,    // b in farsiLetters
}[];

const k = require( "./الکافی.json" ) as db;
const q = require( "./غررالحکم.json" ) as db;
const m = require( "./متفرقه.json" ) as db;
const n = require( "./نهج‌الفصاحة.json" ) as db;
const b = require( "./نهج‌البلاغة.json" ) as db;
const z = require( "./كنز‌العمّال.json" ) as db;
const h = require( "./بحار‌الأنوار.json" ) as db;
const t = require( "./تحف‌العقول.json" ) as db;
const v = require( "./وسائل‌الشيعه.json" ) as db;

export const Hadith = [ 
    ...k,...q,...m,...n,...b,...z,...h,...t,...v
];
