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
