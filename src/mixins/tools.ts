import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import store                            from "@/store/store"
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { c_map }                        from "@/db/H/info"
// * tns plugin add nativescript-toast
import * as Toast                       from "nativescript-toast"

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

export function quranTextPreviewer ( id: number ) {
    const str = Quran[ id ].text;
    return str;
}

export function quranAddress ( id: number ) {

    const i = Quran[ id ];
    const suraName = asma[ i.sura -1 ][1];
    const suraNumber = arabicDigits( asma[ i.sura -1 ][0] +"" );

    return ( suraName + "(" + suraNumber + ") | " + arabicDigits( i.ayah +"" ) );

}

// -- =====================================================================================

export function hadithTextPreviewer ( id: number ) {

    let limit = 440,
        str = Hadith[ id ].a;

    str = str.replace( /<Q> \)/g, "" );
    str = str.replace( /\( <\/Q>/g, "" );
    str = str.replace( /<Q>/g, "" );
    str = str.replace( /<\/Q>/g, "" );

    if ( str.length > limit ) str = str.slice( 0, limit ) + " ...( المزيد )";

    return str;

}

export function hadithAddress ( id: number ) {

    const i = Hadith[ id ];
    if ( typeof i.d === "number" ) {
        const bookName = "الکافی";
        const hadithNumber = arabicDigits( i.d +"" );
        return ( bookName + " | " + hadithNumber );
    }
    else return null;

}

// -- =====================================================================================

export function contentPreviewer ( source:TS.Source, id: number ): TS.FoundContent {

    let code_O = "Q_" + store.state.activeAyah,
        code_X = source + "_" + id,
        isBounded: boolean;

    try { isBounded = store.state.cakeBound[ code_O ].includes( code_X ) } catch {}

    let content: TS.FoundContent = {
        id: id,
        source: source,
        text: null,
        flags: {
            isBounded: isBounded
        }
    };

    if ( source === "Q" ) {
        content.text = quranTextPreviewer( id );
        content.flags.address = quranAddress( id );
    }
    if ( source === "H" ) {
        content.text = hadithTextPreviewer( id );
        content.flags.address = hadithAddress( id );

    }

    return content;

}

// -- =====================================================================================

export function scapeCheck ( mode: TS.search_By ) {

    if ( store.state.foundData.length && store.state.searched_By === mode ) {
        store.state.searched_By = null;
        store.state.foundData = [];
        store.state.foundDataSlot = null;
        return true;
    }

    return false;

}

// -- =====================================================================================

export function searchBoxResetter ( limited=false ) {
    store.state.searched_By = null;
    store.state.foundData = [];
    store.state.foundDataSlot = null;
    if ( limited ) return;
    store.state.fraseInSearch = null;
} 

// -- =====================================================================================

export function boundParser ( item: string, flags: TS.Flags ={} ): TS.FoundContent {

    let source = item.slice(0, 1) as TS.Source,
        id = Number( item.slice(2) ) as number,
        found: TS.FoundContent;

    // .. convert N to ID
    if ( source === "H" ) id = Hadith.findIndex( x => x.n === id );

    if ( source === "Q" || source === "H" ) {

        let text: string = "";
        found = { id: id, text: text, source: source, flags: flags };

        if ( source === "Q" ) {
            found.text = quranTextPreviewer(id);
            found.flags.address = quranAddress(id);
        }
        if ( source === "H" ) {
            found.text = hadithTextPreviewer(id);
            found.flags.address = hadithAddress(id);
        }

    }

    return found;

}

// -- =====================================================================================

export function getHistory (): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.memo[ store.state.search_IN ] ) 
        found.unshift( contentPreviewer( store.state.search_IN, m ) );

    return found;

}

// -- =====================================================================================

export function getFavorite (): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.fav[ store.state.search_IN ] ) 
        found.unshift( contentPreviewer( store.state.search_IN, m ) );

    return found;

}

// -- =====================================================================================

export function search_Q ( phrase: string ): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];

    for ( let i = 0; i < Quran.length; i++ )
        if ( Quran[i].simpleInFarsiLetters.includes( phrase ) )
            found.push( contentPreviewer( "Q", i ) );

    return found;

}

// -- =====================================================================================

export function search_H ( phrase: string ): TS.FoundContent[] {

    let found: TS.FoundContent[] = [];
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

export function bounder_Q (): TS.FoundContent[] { 

    let found: TS.FoundContent[] = [],
        code_O = "Q_" + store.state.activeAyah,
        code_Xs = store.state.cakeBound[ code_O ] || [],
        isBounded: boolean;

    // .. convert codes to the content
    for ( let raw of code_Xs ) {
        isBounded = store.state.cakeBound[ raw ].includes( code_O );
        found.push( boundParser( raw, { isBounded: isBounded } ) );
    }

    if ( found ) {

        // .. preparing
        store.state.foundData = [];
        store.state.foundDataSlot = "M4";

        // .. add Header
        found.unshift( boundParser( code_O, { isHeader: true } ) );

        // .. append cached Items
        found = bounder_Q_Cache( found );

    }

    return found.filter( x => x );

}

// -- =====================================================================================

export function bounder_Q_Cache ( base: TS.FoundContent[] ): TS.FoundContent[] { 

    let origin = "Q_" + store.state.activeAyah,
        cache: string[],
        tmp: TS.FoundContent;

    cache = store.state.cacheBound.reduce( (soFar, xxx) => {
        if ( xxx[0] === origin ) soFar.push( xxx[1] );
        else if ( xxx[1] === origin ) soFar.push( xxx[0] );
        return soFar;
    }, [] as string[] );

    for ( let c of cache ) base.push( boundParser( c, { isCached: true } ) );

    return base;

}

// -- =====================================================================================

export function bound_Q_Toggler ( item: TS.FoundContent ): TS.CakeBound { 

    let code_O = "Q_" + store.state.activeAyah,
        code_X: string;

    switch ( item.source ) {
        // .. convert ID to N
        case "H": code_X = "H_" + Hadith[ item.id ].n;  break;
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

export function getTags (): TS.FoundContent[] {

    let code_O = "Q_" + store.state.activeAyah,
        tagsName: string[],
        item: TS.FoundContent,
        found: TS.FoundContent[] = [];

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

    hadith.toShare = getSharedText( hadith );

    return hadith;

}

// -- =====================================================================================

function getSharedText ( hadith: TS.Hadith ) {

    let str: string = "";

    str += hadith.from;
    str += " )" + hadith.salam + "(:\n\n";
    str += hadith.kalamat.reduce( (f,x) => f + " " + x.text , "" ).trim();

    if ( hadith.farsi ) str += "\n\n" + hadith.farsi;
    if ( hadith.source ) str += "\n\n" + hadith.source;

    str = simpleText( str );

    return str;

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
