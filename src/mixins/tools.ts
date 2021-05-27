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

    let activeAyah = store.state.activeAyah,
        itemCode = source + "_" + id,
        originCode = "Q_" + activeAyah,
        isBounded: boolean;

    try { isBounded = store.state.cakeBound[ originCode ].includes( itemCode ) } catch {}

    let content: TS.FoundContent = {
        id: id,
        source: source,
        text: null,
        flags: {
            isBounded: isBounded
        }
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

    str = erabTrimmer( str );
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

    return str;

}

// -- =====================================================================================

export function scapeCheck ( mode: TS.SearchMode ) {

    if ( store.state.foundData.length && store.state.searchMode_Pr === mode ) {
        store.state.searchMode_Pr = null;
        store.state.foundData = [];
        store.state.foundDataSlot = null;
        return true;
    }

    return false;

}

// -- =====================================================================================

export function searchBoxResetter ( limited=false ) {
    store.state.searchMode_Pr = null;
    store.state.foundData = [];
    store.state.foundDataSlot = null;
    if ( limited ) return;
    store.state.phraseInSearch = null;
    // store.state.activeAyah = -1;
} 

// -- =====================================================================================

export function boundParser ( item: string, flags: TS.Flags ={} ): TS.FoundContent {

    let source = item.slice(0, 1) as TS.Source;
    let id = Number( item.slice(2) ) as number;

    if ( source === "Q" ) 
        return { id: id, text: quranTextPreviewer(id), source: source, flags: flags }
    if ( source === "H" ) 
        return { id: id, text: hadithTextPreviewer(id), source: source, flags: flags }

    return null;

}

// -- =====================================================================================

export function getHistory (): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.memo[ store.state.searchSource ] ) 
        found.unshift( contentPreviewer( store.state.searchSource, m ) );

    return found;

}

// -- =====================================================================================

export function getFavorite (): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.fav[ store.state.searchSource ] ) 
        found.unshift( contentPreviewer( store.state.searchSource, m ) );

    return found;

}

// -- =====================================================================================

export function search_Q ( phrase: string ): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( let i = 0; i < Quran.length; i++ )
        if ( inFarsiLetters( Quran[i].simple ).includes( phrase ) )
            found.push( contentPreviewer( "Q", i ) );

    return found;

}

// -- =====================================================================================

export function search_H ( phrase: string ): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( let i = 0; i < Hadith.length; i++ ) {

        // .. search in arabic text
        if ( inFarsiLetters( Hadith[i].a ).includes( phrase ) )
            found.push( contentPreviewer( "H", i ) );

        // // .. search in farsi text ( if exists )
        // else if ( Hadith[i].b )
        //     if ( tools.inFarsiLetters( Hadith[i].b ).includes( phrase ) )
        //         found.push( tools.contentPreviewer( "H", i ) );

    }

    return found.filter( (x,i) => i<50 );

}

// -- =====================================================================================

export function bounder_Q (): void {

    let found: TS.FoundContent[] = [],
        tmp: TS.FoundContent,
        originCode = "Q_" + store.state.activeAyah,
        itemCodes = store.state.cakeBound[ originCode ] || [],
        isBounded: boolean;

    // .. convert codes to the content
    for ( let raw of itemCodes ) {
        isBounded = store.state.cakeBound[ raw ].includes( originCode );
        tmp = boundParser( raw, { isBounded: isBounded } );
        if ( tmp ) found.push( tmp );
    }

    if ( found ) {

        // .. preparing
        store.state.foundData = [];
        store.state.foundDataSlot = "M4";

        // .. add Header
        found.unshift( boundParser( originCode, { isHeader: true } ) );

        // .. append cached Items
        found = bounder_Q_Cache( found );

        // .. implanting ...
        store.state.foundData = found;

    }

}

// -- =====================================================================================

export function bounder_Q_Cache ( base: TS.FoundContent[] ): TS.FoundContent[] { 

    let origin = "Q_" + store.state.activeAyah,
        cache: string[];

    cache = store.state.cacheBound.reduce( (soFar, xxx) => {
        if ( xxx[0] === origin ) soFar.push( xxx[1] );
        else if ( xxx[1] === origin ) soFar.push( xxx[0] );
        return soFar;
    }, [] as string[] );

    for ( let c of cache ) base.push( boundParser( c, { isCached: true } ) );

    return base;

}

// -- =====================================================================================

export function bound_Q_Toggler ( item: TS.FoundContent ): void { 

    let originCode = "Q_" + store.state.activeAyah,
        itemCode = item.source + "_" + ( item.source === "T" ? item.text : item.id );

    // .. insert New Bound Info!
    if ( !item.flags.isBounded ) storage.rawBound.push( [ originCode, itemCode ] );
    // .. remove CrossBound Info
    else {
        let r: number;
        r = storage.rawBound.findIndex( x => x[0] === originCode && x[1] === itemCode );
        if ( ~r ) storage.rawBound.splice( r, 1 );
        r = storage.rawBound.findIndex( x => x[1] === originCode && x[0] === itemCode );
        if ( ~r ) storage.rawBound.splice( r, 1 );
        // .. cache Bound Info!
        store.state.cacheBound.push( [ originCode, itemCode ] );
    }

    // .. trim cacheBound
    if ( item.flags.isCached ) {
        store.state.cacheBound = store.state.cacheBound.filter( x => {
            if ( x[0] === originCode && x[1] === itemCode ) return false;
            if ( x[1] === originCode && x[0] === itemCode ) return false;
            return true;
        } );
    }

    // .. re-calculation
    store.state.cakeBound = storage.rawBoundConvertor( storage.rawBound );

}

// -- =====================================================================================

export function getTags (): TS.FoundContent[] {

    let originCode = "Q_" + store.state.activeAyah,
        tagsName: string[],
        item: TS.FoundContent,
        found: TS.FoundContent[] = [];

    // .. filter Tags
    tagsName = Object.keys( store.state.cakeBound ).filter( t => t.slice(0, 1) === "T" );

    // .. convert list to found
    found = Object.values( tagsName ).map( (x, i) => {
        item = { id: i, text: x.slice(2), source: "T", flags: {} };
        item.flags.isBounded = store.state.cakeBound[x].includes( originCode );
        return item;
    } );

    return found;

}

// -- =====================================================================================
