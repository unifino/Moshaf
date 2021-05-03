declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import * as NS                          from "@nativescript/core"
import { asma, quran }                  from "@/db/quran"

// -- =====================================================================================

export let Quran: { sura: string, ayah: number, text:string }[];
export let trace: { ayah: number, date: string|boolean }[];

const exStorage = android.os.Environment.getExternalStorageDirectory();
export const SDCard: string = exStorage.getAbsolutePath().toString();

export let myFolder : NS.Folder; // * do not initiate it
export let QuranFile: NS.File;   // * do not initiate it
export let traceFile: NS.File;   // * do not initiate it

// -- =====================================================================================

export function db_check () {

    return new Promise ( (rs, rx) => { 

        // .. permission policy has been meet, so assign necessarily Folders!
        myFolder  = NS.Folder.fromPath( NS.path.join( SDCard, "Moshaf" ) );

        // .. init
        let bp = myFolder.path;
        QuranFile = NS.File.fromPath ( NS.path.join( bp, "quran.json"  ) );
        traceFile = NS.File.fromPath ( NS.path.join( bp, "trace.json"  ) );

        // .. get Contents
        try { Quran = JSON.parse( QuranFile.readTextSync() ) } catch { Quran = [] }
        try { trace = JSON.parse( traceFile.readTextSync() ) } catch { trace = [] }

        // .. check integrity 
        if ( Quran.length === 6236 ) rs( Quran );
        else {
            // .. save traces
            saveTrace();
            // .. init Quran
            QuranFile.writeText( JSON.stringify( quran, null, "\t" ) )
            .then( () => rs( quran ) )
            .catch( err => rx( "Could Not Create initial Files!!" ) );
        }

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