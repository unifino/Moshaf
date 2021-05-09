declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import * as NS                          from "@nativescript/core"

// -- =====================================================================================

export let trace: { ayah: number, date: string|boolean }[];

const exStorage = android.os.Environment.getExternalStorageDirectory();
export const SDCard: string = exStorage.getAbsolutePath().toString();

export let myFolder : NS.Folder; // * do not initiate it
export let traceFile: NS.File;   // * do not initiate it

// -- =====================================================================================

export function db_check (): Promise<void> {

    return new Promise ( (rs, rx) => { 

        // .. permission policy has been meet, so assign necessarily Folders!
        myFolder  = NS.Folder.fromPath( NS.path.join( SDCard, "Moshaf" ) );

        // .. init
        let bp = myFolder.path;
        traceFile = NS.File.fromPath ( NS.path.join( bp, "trace.json"  ) );

        // .. get Contents
        try { trace = JSON.parse( traceFile.readTextSync() ) } catch { trace = [] }

        // .. check integrity 
        if ( !trace ) saveTrace();

        // .. resolve
        rs();

    } );

}

// -- =====================================================================================

export async function saveTrace ( ayah?: number, date?: string|boolean ) {
    // .. add new trace
    if ( date ) trace.push( { ayah: ayah, date: date } );
    // .. write down file
    traceFile.writeText( JSON.stringify( trace ) );
}

// -- =====================================================================================

export function saveTest ( name: string, ext: "html"|"json"|"ts", text: string ) {
    // .. init
    let bp = myFolder.path;
    let testFile = NS.File.fromPath ( NS.path.join( bp, name + "." + ext  ) );
    testFile.writeText( text );
}

// -- =====================================================================================

export function uniqefiy ( collection: { a: string, b: string, c: number, d?: string }[] ) {

    console.log(collection.length);

    let unique = collection.reduce( (f, x) => {

        let dk = f.find( y =>
            y.a === x.a
            &&
            y.b === x.b
            &&
            x.c === y.c
            &&
            x.d === y.d
        );

        if ( dk ) {
            console.log( x.a );
            console.log( dk.a );
        }

        return !dk ? f.concat([x]) : f;

    }, [] );

    console.log( unique.length );

    let newC = JSON.stringify( unique, null, "\t" );
    saveTest( "newC", "ts", newC );

}

// -- =====================================================================================

export function sometool ( data: {
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

