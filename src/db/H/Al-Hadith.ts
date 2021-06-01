type db = {
    a: string,
    b: string,
    c: number,
    d?: string|number,
    n: number,

    aF?: string,
    bF?: string,
}[];

const Kafi = require( "./Al-Kafi.json" ) as db; 
const misc = require( "./Misc.json" ) as db; 
const mox = require( "./mox.json" ) as db; 

export const Hadith = [ ...mox ];