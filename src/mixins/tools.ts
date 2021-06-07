import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import store                            from "@/store/store"
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { c_map }                        from "@/db/H/info"
// * tns plugin add nativescript-toast
import * as Toast                       from "nativescript-toast"
import { info } from "node:console"

// -- =====================================================================================

let toaster_TO: NodeJS.Timeout | any;
let toasty;
export function toaster ( msg: string ="" , duration: "short" | "long" = "short" ) {

    if ( toaster_TO ) clearTimeout( toaster_TO );
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
    const erabs = [
        "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",
        "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ", 
        "ـ",
    ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
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
        .replace( /ك/g, 'ک' )
        .replace( /ي/g, 'ی' )
        .replace( /ﺉ/g, 'ی' )
        .replace( /ئ/g, 'ی' )
        .replace( /ى/g, 'ی' );
        // .replace( /ڑ/g, 'ر' );

    return str;

}

// -- =====================================================================================

export function contentPreviewer ( source:TS.Source, id: number ): TS.ItemFound {

    let code_O = "Q_" + store.state.activeAyah,
        code_X = source + "_" + id,
        isBounded: boolean,
        info = getInfo( source, id );

    try { isBounded = store.state.cakeBound[ code_O ].includes( code_X ) } catch {}

    let content: TS.ItemFound = {
        id: id,
        source: source,
        text: info.previewText,
        flags: {
            isBounded: isBounded,
            address: info.address,
        }
    };
 
    return content;

}

// -- =====================================================================================

export function scapeCheck ( mode: TS.search_By ) {

    // ! check this
    // if ( store.state.foundData.length && store.state.searched_By === mode ) {
    //     store.state.searched_By = null;
    //     store.state.foundDataSlot = null;
    //     return true;
    // }

    return false;

}

// -- =====================================================================================

// ! remove this
export function clearSearchBox ( limited=false ) {
    // store.state.searched_By = null;
    // store.state.foundData = [];
    // store.state.foundDataSlot = null;
    // if ( limited ) return;
    // store.state.fraseInSearch = null;
} 

// -- =====================================================================================

export function bindItem_Generator ( code: string, flags: TS.Flags ={} ): TS.ItemFound {

    let source = code.slice(0, 1) as TS.Source,
        id = Number( code.slice(2) ) as number,
        item: TS.ItemFound;

    // ! check other sources!
    let text: string = "";
    item = { id: id, text: text, source: source, flags: flags };

    item.text = getInfo( source, id ).previewText;

    if ( source === "Q" ) {
        item.flags.address = quranAddress(id);
    }
    if ( source === "H" ) {
        item.flags.address = Hadith[ id ].d || "";
    }

    return item;

}

// -- =====================================================================================

export function getHistory (): TS.ItemFound[] {

    let found: TS.ItemFound[] = [];

    if ( store.state.search_IN === "Q" )
        for ( const m of store.state.memo[ "Q" ] )
            if ( m !== store.state.activeAyah )
                found.unshift( contentPreviewer( "Q", m ) );


    if ( store.state.search_IN === "H" )
        for ( const m of store.state.memo[ "H" ] )
            found.unshift( contentPreviewer( "H", m ) );

    return found;

}

// -- =====================================================================================

export function setHistory ( source: TS.Source, id: number ) {
    // .. add trace ( unique! )
    let old = store.state.memo[ source ].findIndex( x => x === id );
    if ( ~old ) store.state.memo[ source ].splice( old, 1 );
    store.state.memo[ source ].push( id );
    // .. hard registration
    let traceName = 'trace_' + source.toLowerCase();
    storage.saveDB( storage[ traceName + "_File" ], store.state.memo[ source ], 44 );
}

// -- =====================================================================================

export function getFavorite (): TS.ItemFound[] {

    let items: TS.ItemFound[] = [];

    for ( const m of store.state.fav[ store.state.search_IN ] ) 
        items.unshift( contentPreviewer( store.state.search_IN, m ) );

    return items;

}

// -- =====================================================================================

export function search_Q ( phrase: string ): TS.ItemFound[] {

    let found: TS.ItemFound[] = [];

    for ( let i = 0; i < Quran.length; i++ )
        if ( Quran[i].simpleInFarsiLetters.includes( phrase ) )
            found.push( contentPreviewer( "Q", i ) );

    return found;

}

// -- =====================================================================================

export function search_H ( phrase: string ): TS.ItemFound[] {

    let found: TS.ItemFound[] = [];
    let words = phrase.split( " " );
    let matrix: number[][] = [];
    let tmpRow:number[];
    let matches: number[] = [];

    for ( let word of words ) {
        tmpRow = [];
        if ( word ) {
            for ( let i = 0; i < Hadith.length; i++ ) {
                // .. search in arabic|farsi text
                if ( Hadith[i].aF.includes( word ) || Hadith[i].bF.includes( word ) )
                    tmpRow.push(i);
            }
        }
        matrix.push( tmpRow );
    }

    // .. remove empty rows
    for ( let i in matrix ) if ( !matrix[i].length ) matrix.splice( Number(i), 1 );

    // .. check if it contains in all rows ( all words found in one Hadith )
    let permission: number;
    for ( let row of matrix ) {
        for ( let cell of row ) {
            permission = 0;
            for ( let re_row of matrix ) if ( re_row.includes( cell ) ) permission++;
            if ( permission === matrix.length ) matches.push( cell );
        }
    }

    // .. remove duplicated
    matches = [ ...new Set(matches) ];

    for ( let id of matches ) found.push( contentPreviewer( "H", id ) );

    return found.filter( (x,i) => i<50 );

}

// -- =====================================================================================

export function foundBounds ( source: TS.Source, id: number ): TS.ItemFound[] { 

    let found: TS.ItemFound[] = [],
        code_O = source + "_" + id,
        x_codes = store.state.cakeBound[ code_O ] || [],
        isBounded: boolean;

    // .. convert codes to the content
    for ( let code_X of x_codes ) {
        isBounded = store.state.cakeBound[ code_X ].includes( code_O );
        found.push( bindItem_Generator( code_X, { isBounded: isBounded } ) );
    }

    if ( found ) {

        // .. preparing
        // ! chcek this
        // store.state.foundData = [];
        store.state.foundDataSlot = "M4";

        // .. add Header
        found.unshift( bindItem_Generator( code_O, { isHeader: true } ) );

        // .. append cached Items
        found = bounder_Q_Cache( found );

    }

    return found.filter( x => x );

}

// -- =====================================================================================

export function bounder_Q_Cache ( base: TS.ItemFound[] ): TS.ItemFound[] { 

    let origin = "Q_" + store.state.activeAyah,
        cache: string[],
        tmp: TS.ItemFound;

    cache = store.state.cacheBound.reduce( (soFar, xxx) => {
        if ( xxx[0] === origin ) soFar.push( xxx[1] );
        else if ( xxx[1] === origin ) soFar.push( xxx[0] );
        return soFar;
    }, [] as string[] );

    for ( let c of cache ) base.push( bindItem_Generator( c, { isCached: true } ) );

    return base;

}

// -- =====================================================================================

export function bound_Q_Toggler ( item: TS.ItemFound ): TS.CakeBound { 

    let code_O = "Q_" + store.state.activeAyah,
        code_X: string;

    switch ( item.source ) {
        case "T": code_X = "T_" + item.text;            break;
        default : code_X = item.source + "_" + item.id; break;
    }

    // .. insert New Bound Info!
    if ( !item.flags.isBounded ) storage.rawBound.push( [ code_O, code_X ] );
    // .. remove CrossBound Info
    else {
        let r: number;
        r = storage.rawBound.findIndex( x => x[0] === code_O && x[1] === code_X );
        if ( ~r ) storage.rawBound.splice( r, 1 );
        r = storage.rawBound.findIndex( x => x[1] === code_O && x[0] === code_X );
        if ( ~r ) storage.rawBound.splice( r, 1 );
        // .. cache Bound Info!
        store.state.cacheBound.push( [ code_O, code_X ] );
    }

    // .. trim cacheBound
    if ( !item.flags.isBounded ) {
        store.state.cacheBound = store.state.cacheBound.filter( x => {
            if ( x[0] === code_O && x[1] === code_X ) return false;
            if ( x[1] === code_O && x[0] === code_X ) return false;
            return true;
        } );
    }

    // .. re-calculation
    return storage.rawBoundConvertor( storage.rawBound );

}

// -- =====================================================================================

export function getTags (): TS.ItemFound[] {

    let code_O = "Q_" + store.state.activeAyah,
        tagsName: string[],
        item: TS.ItemFound,
        found: TS.ItemFound[] = [];

    // .. filter Tags
    tagsName = Object.keys( store.state.cakeBound ).filter( t => t.slice(0, 1) === "T" );

    // .. convert list to found
    found = Object.values( tagsName ).map( (x, i) => {
        item = { id: i, text: x.slice(2), source: "T", flags: {} };
        item.flags.isBounded = store.state.cakeBound[x].includes( code_O );
        return item;
    } );

    return found;

}

// -- =====================================================================================

export function saheb ( from: "Q"|"H" ) {
    let saat = new Date();
    let rand = saat.getTime() % ( from === "Q" ? Quran.length : Hadith.length );
    return rand;
}

// -- =====================================================================================

export function getHadith ( id: number ) {

    let hadith: TS.Hadith = { obj: Hadith[ id ] } as any;

    // .. mini patch
    if ( Hadith[ id ].c === null ) Hadith[ id ].c = 19;

    // .. assign the from whom
    hadith.from = c_map[ Hadith[ id ].c ][0];
    hadith.salam = c_map[ Hadith[ id ].c ][1];
    // .. assign arabic part
    hadith.kalamat = [];
    // .. assign arabi part
    hadith.arabi = simpleText( Hadith[ id ].a );
    // .. assign farsi part
    hadith.farsi = Hadith[ id ].b || "";
    // .. assign source
    hadith.source = Hadith[ id ].d || "";

    let tmpBox = Hadith[ id ].a.replace( / +/g, " " ).trim().split( ' ' );
    let gFuse = false;
    for ( let tmp of tmpBox ) {
        if ( ( tmp.match( /<.?Q>/ ) || [] ).length ) {
            gFuse = !gFuse;
            tmp = tmp.replace( /<.?Q>/g, '' );
        }
        if ( tmp ) hadith.kalamat.push( { text: tmp, isGreen: gFuse } );
    }

    hadith.toShare = getSharedText_H( hadith );

    return hadith;

}

// -- =====================================================================================

function simpleText ( str ) {
    str = str.replace( /<.?Q>/g, ' ' );
    str = str.replace( /\(/g, 'HBT_v1' );
    str = str.replace( /\)/g, '(' );
    str = str.replace( /HBT_v1/g, ')' );
    str = str.replace( / +/g, ' ' );
    return str;
}

// -- =====================================================================================

export function getInfo ( source: TS.Source, id: number ) {

    let tmp: string,
        limit = 440,
        info: {
        source: TS.Source,
        id: number,
        text: string,
        previewText: string,
        address: string,
    } = <any>{};

    info.source = source;
    info.id = id;

    if ( source === "Q" ) {
        info.address = quranAddress( id );
        info.text = Quran[ id ].text + "\n\n" + info.address;
        tmp = Quran[ id ].text;
        if ( tmp.length > limit ) tmp = tmp.slice( 0, limit ) + " ...";
        info.previewText = tmp;
    }

    if ( source === "H" ) {
        info.address = Hadith[ id ].d || "";
        info.text = textOfHadith( id );
        tmp = Hadith[ id ].a.replace( /<.?Q>/g, "" );
        if ( tmp.length > limit ) tmp = tmp.slice( 0, limit ) + " ...( المزيد )";
        info.previewText = tmp;
    }

    return info;
}

export function quranAddress ( id: number ) {

    const i = Quran[ id ];
    const suraName = asma[ i.sura -1 ][1];
    const suraNumber = arabicDigits( asma[ i.sura -1 ][0] +"" );

    return ( suraName + "(" + suraNumber + ") | " + arabicDigits( i.ayah +"" ) );

}

// ! remove it
export function getSharedText_H ( hadith: TS.Hadith ) {

    let str: string = "";

    str += hadith.from;
    str += " )" + hadith.salam + "(:\n\n";
    str += hadith.kalamat.reduce( (f,x) => f + " " + x.text , "" ).trim();

    if ( hadith.farsi ) str += "\n\n" + hadith.farsi;
    if ( hadith.source ) str += "\n\n" + hadith.source;

    str = simpleText( str );

    return str;

}

export function textOfHadith ( id: number ) {

    let str: string = "";

    // .. mini patch
    if ( Hadith[ id ].c === null ) Hadith[ id ].c = 19;

    str += c_map[ Hadith[ id ].c ][0];
    str += " )" + c_map[ Hadith[ id ].c ][1] + "(:\n\n";
    str += Hadith[ id ].a.replace( /<.?Q>/g, '' );

    if ( Hadith[ id ].b ) str += "\n\n" + Hadith[ id ].b;
    if ( Hadith[ id ].d ) str += "\n\n" + Hadith[ id ].d;


    str = simpleText( str );

    return str;

}

// -- =====================================================================================
