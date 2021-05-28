declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"

// -- =====================================================================================

let trace_q : number[];
let trace_h : number[];
let fav_q   : number[];
let fav_h   : number[];
export let rawBound: TS.RawBound;

const exStorage = android.os.Environment.getExternalStorageDirectory();
const SDCard: string = exStorage.getAbsolutePath().toString();

let myFolder : NS.Folder;    // * do not initiate it
export let trace_q_File: NS.File;   // * do not initiate it
export let trace_h_File: NS.File;   // * do not initiate it
export let fav_q_File: NS.File;     // * do not initiate it
export let fav_h_File: NS.File;     // * do not initiate it
export let bound_File: NS.File;     // * do not initiate it

// -- =====================================================================================

export function db_check (): Promise<void> {

    return new Promise ( (rs, rx) => { 

        // .. permission policy has been meet, so assign necessarily Folders!
        myFolder  = NS.Folder.fromPath( NS.path.join( SDCard, "Moshaf" ) );

        // .. init
        let bp = myFolder.path;
        trace_q_File = NS.File.fromPath ( NS.path.join( bp, "trace_q.json"  ) );
        trace_h_File = NS.File.fromPath ( NS.path.join( bp, "trace_h.json"  ) );
        fav_q_File   = NS.File.fromPath ( NS.path.join( bp, "fav_q.json"  ) );
        fav_h_File   = NS.File.fromPath ( NS.path.join( bp, "fav_h.json"  ) );
        bound_File   = NS.File.fromPath ( NS.path.join( bp, "bind.json"  ) );

        // .. get Contents
        try { trace_q = JSON.parse( trace_q_File.readTextSync() ) } catch { trace_q = [] }
        try { trace_h = JSON.parse( trace_h_File.readTextSync() ) } catch { trace_h = [] }
        try { fav_q   = JSON.parse( fav_q_File.readTextSync()   ) } catch { fav_q   = [] }
        try { fav_h   = JSON.parse( fav_h_File.readTextSync()   ) } catch { fav_h   = [] }
        try { rawBound= JSON.parse( bound_File.readTextSync()   ) } catch { rawBound= [] }

        // .. check integrity 
        if ( !trace_q ) saveDB( trace_q_File, [] );
        if ( !trace_h ) saveDB( trace_h_File, [] );
        if ( !fav_q   ) saveDB( fav_q_File, [] );
        if ( !fav_h   ) saveDB( fav_h_File, [] );
        if ( !rawBound) saveDB( bound_File, [] );

        store.state.fav.Q = fav_q;
        store.state.fav.H = fav_h;
        store.state.memo.Q = trace_q;
        store.state.memo.H = trace_h;
        store.state.cakeBound = rawBoundConvertor( rawBound );

        // .. resolve
        rs();

    } );

}

// -- =====================================================================================

export async function saveDB ( file: NS.File, data: any[], limit?: number ) {

    if ( limit ) data = data.filter( (x,i) => i > data.length - limit );
    // .. write down file
    file.writeText( JSON.stringify( data ) );

}

// -- =====================================================================================

export function saveTest ( name: string, ext: "html"|"json"|"ts", text: string ) {
    // .. init
    let bp = myFolder.path;
    let testFile = NS.File.fromPath ( NS.path.join( bp, name + "." + ext  ) );
    testFile.writeText( text );
}

// -- =====================================================================================

export function unique ( hadith: { a: string, b: string, c: number, d?: string }[] ) {

    console.log( hadith.length );

    let unique = hadith.reduce( (f, x) => {

        let dk = f.find( y =>
            y.a === x.a
            &&
            y.b === x.b
            &&
            x.c === y.c
            &&
            x.d === y.d
        );

        return !dk ? f.concat([x]) : f;

    }, [] );

    console.log( unique.length );

    let newC = JSON.stringify( unique, null, "\t" );
    saveTest( "newC", "ts", newC );

}

// -- =====================================================================================

export function some_tool ( data: {
    a: string, 
    b: string, 
    c: number, 
    d?: string,
    ar?: string,
    fa?: string,
}[] ) {

    let h = "الإمامُ الصّادقُ عليه السلام";

    let ok = JSON.stringify( 
        data.filter( x => x.ar === x.fa && x.fa === h ) , null, "\t"
    );

    let some = JSON.stringify( 
        data.filter( x => x.ar !== x.fa && ( x.ar === h || x.fa === h ) ), null, "\t"
    );

    let other = JSON.stringify( 
        data.filter( x => x.ar !== h && x.fa !== h ), null, "\t"
    );

    saveTest( "ok", "ts" , ok );
    saveTest( "some", "ts" , some );
    saveTest( "other", "ts" , other );

}

// -- =====================================================================================

// export function test () {
//     let newB: TS.Bound = [];
//     bound.forEach( x=> {
//         let p: TS.BoundItem;
//         p = [ 
//             [ x[0].slice(0,1) as "Q", Number(x[0].slice(2)) || x[0].slice(2) as any ], 
//             [ x[1].slice(0,1) as "Q", Number(x[1].slice(2)) || x[1].slice(2) as any ] 
//         ]
//         newB.push( p )
//     })
//     saveTest( "newBound", "json" , JSON.stringify(newB) );
// }

// -- =====================================================================================

export function rawBoundConvertor ( rawBound: [ string, string ][] ): TS.CakeBound {

    let cake: TS.CakeBound = {};

    let a: number,
        b: number;

    for ( let r of rawBound ) {

        a = 0; b = 1;
        // .. Add new Taste into the Cake
        if ( !( r[a] in cake ) ) cake[ r[a] ] = [ r[b] ];
        // .. Already-Tastes takes new Data ( Unique ) 
        else if ( !cake[ r[a] ].includes( r[b] ) ) cake[ r[a] ].push( r[b] );

        a = 1; b = 0;
        // .. Add new Taste into the Cake
        if ( !( r[a] in cake ) ) cake[ r[a] ] = [ r[b] ];
        // .. Already-Tastes takes new Data ( Unique ) 
        else if ( !cake[ r[a] ].includes( r[b] ) ) cake[ r[a] ].push( r[b] );

    }

    return cake;

}

// -- =====================================================================================
