// * tns plugin add nativescript-toast
import * as Toast                       from "nativescript-toast"
import { asma, Quran }                  from "@/db/Q/Quran"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import { ahadis }                       from "@/db/H/Ahadis"

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

export function textPreviwer ( id: number ) {
    const ref = Quran[ id ];
    const suraName = asma[ ref.sura -1 ][1];
    const suraID = asma[ ref.sura -1 ][0];
    const str = ref.text + "\n[ " + suraName + "(" + suraID + ") : " + ref.ayah + " ]";
    return str;
}

// -- =====================================================================================

export function asmaUnifier ( str: string ) {

    str = str.replace( /ى/g, 'ي' ).
        replace( /إ/g, 'ا' ).
        replace( /أ/g, 'ا' ).
        replace( /ة/g, 'ه' ); 

    return str;

}

// -- =====================================================================================

export function history ( target: 'q'|'h' ) {

    let found: TS.Found = [];

    for ( const h of storage[ 'trace_' + target ] ) {

        if ( target === 'q' ) {
            found.unshift( { text: textPreviwer( h.ayah ), idx: h.ayah } );
        }

        if ( target === 'h' ) {
            const ref = ahadis[ h.hadis ];
            if ( ref ) found.unshift( { text: ref.a, idx: h.hadis } );
        }

    }

    return found;

}

// -- =====================================================================================

export function favorite ( target: 'q'|'h' ) {

    let found: TS.Found = [];

    for ( const f of storage[ 'fav_' + target ] ) {

        if ( target === 'q' ) {
            found.unshift( { text: textPreviwer( f ), idx: f } );
        }

        if ( target === 'h' ) {
            const ref = ahadis[ f ];
            found.unshift( { text: ref.a, idx: f } );
        }

    }

    return found;

}

// -- =====================================================================================

export function search ( target: 'q'|'h', phrase: string, force=false ) {

    let found: TS.Found = [];

    // .. input must be unified!
    phrase = phrase.replace( /ی/g, 'ي' );
    phrase = phrase.replace( /ک/g, 'ك' );
    phrase = erabTrimmer( phrase );

    if ( phrase.length > 3 || force ) {

        if ( target === 'q' )
            for ( const i in Quran )
                if ( asmaUnifier( Quran[i].simple ).includes( phrase ) )
                    found.push( { text: textPreviwer( Number(i) ), idx: Number(i) } );

        if ( target === 'h' )
            for ( const i in ahadis )
                if ( asmaUnifier( erabTrimmer( ahadis[i].a ) ).includes( phrase ) )
                    found.push( { text: ahadis[i].a, idx: Number(i) } );

    }

    return found;

}

// -- =====================================================================================
