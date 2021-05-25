declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import * as NS                          from "@nativescript/core"

// -- =====================================================================================

export let trace_q : number[];
export let trace_h : number[];
export let fav_q   : number[];
export let fav_h   : number[];
export let bound   : [ string, string ][];

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
        try { bound   = JSON.parse( bound_File.readTextSync()   ) } catch { bound   = [] }

        // .. check integrity 
        if ( !trace_q ) saveDB( trace_q_File, [] );
        if ( !trace_h ) saveDB( trace_h_File, [] );
        if ( !fav_q   ) saveDB( fav_q_File, [] );
        if ( !fav_h   ) saveDB( fav_h_File, [] );
        if ( !bound   ) saveDB( bound_File, [] );

        // .. resolve
        rs();

    } );

}

// -- =====================================================================================

export async function saveDB ( file: NS.File, data: any[] ) {
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

