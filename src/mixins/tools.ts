// * tns plugin add nativescript-toast
import * as Toast                       from "nativescript-toast"
import { asma, Quran }                  from "@/db/Q/Quran"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import { Hadith }                       from "@/db/H/Al-Hadith"
import store                            from "@/store/store"

// -- =====================================================================================

let toaster_TO: NodeJS.Timeout | any;
let toasty;
export function toaster ( msg: string ="" , duration: "short" | "long" = "short" ) {

    clearTimeout( toaster_TO );
    try{ toasty.cancel() } catch {}
    if ( !msg ) return 0;

    let pad = "";
    if ( msg.length < 7 ) for( let i=0; i< 7-msg.length; i++ ) pad += " ";

    if ( pad ) msg = '\n' + pad + msg.replace( "\n", "" ) + pad + '\n';
    else msg = '\n' + pad + msg + pad + '\n';

    toasty = Toast.makeText( msg, duration );

    toaster_TO = setTimeout( () => toasty.show() , 200 );

}

// -- =====================================================================================

export function arabicDigits ( str: string ) {
    const base = [ '۰','۱','۲','۳','۴','۵','۶','۷','۸','۹' ];
    return str.replace( /[0-9]/g, w => base[+w] );
}

// -- =====================================================================================

export function erabTrimmer ( str: string ) {
    if ( !str ) return "";
    const erabs = [ "َ", "ٕ", "ُ", "ِ", "ٓ", "ٰ", "ٖ", "ً", "ّ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ" ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    return str;
}

// -- =====================================================================================

export function contentPreviewer ( source:TS.Source, id: number ): TS.FoundContent {

    let content: TS.FoundContent = {
        id: id,
        source: source,
        text: null,
        flags: {}
    };

    if ( source === "Q" ) content.text = quranTextPreviewer( id );
    if ( source === "H" ) content.text = hadithTextPreviewer( id );

    return content;

}

// -- =====================================================================================

export function quranTextPreviewer ( id: number ) {
    const c = Quran[ id ];
    const suraName = asma[ c.sura -1 ][1];
    const suraID = asma[ c.sura -1 ][0];
    const str = c.text + "\n[ " + suraName + "(" + suraID + ") : " + c.ayah + " ]";
    return str;
}

export function hadithTextPreviewer ( id: number ) {
    const str = Hadith[ id ].a;
    return str;
}

// -- =====================================================================================

export function inFarsiLetters ( str: string ) {

    if ( !str ) return "";

    str = str
        .replace( /ء/g, 'ا' )
        .replace( /إ/g, 'ا' )
        .replace( /أ/g, 'ا' )
        .replace( /آ/g, 'ا' )
        .replace( /ة/g, 'ه' )
        .replace( /ؤ/g, 'و' )
        .replace( /ؤ/g, 'و' )
        .replace( /ك/g, 'ک' )
        .replace( /ي/g, 'ی' )
        .replace( /ئ/g, 'ی' )
        .replace( /ى/g, 'ی' );

    return erabTrimmer( str );

}

// -- =====================================================================================

export function scapeCheck ( mode: TS.SearchMode ) {

    if ( store.state.foundData.length && store.state.lastSearchedBy === mode ) {
        store.state.lastSearchedBy = null;
        store.state.foundData = [];
        return true;
    }

    return false;

}

// -- =====================================================================================

export function searchBoxResetter () {
    store.state.forceSearchFuse = false;
    store.state.lastSearchedBy = null;
    store.state.phraseInSearch = null;
    store.state.foundData = [];
    store.state.activeAyah = -1;
} 

// -- =====================================================================================

export function quranPreviewer ( id: number ) {
    return null;
}