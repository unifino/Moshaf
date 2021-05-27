<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f002' )"
        @tap="getSearchResult( true )"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as TS                          from "@/../types/myTypes"
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Search extends Vue {

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.foundData.length, 
        () => this.activeClass()
    );

    store.watch(
        state => store.state.phraseInSearch, 
        newVal => { if ( newVal ) this.getSearchResult( newVal.length > 3 ) }
    );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false,
        source = store.state.searchSource;

    if ( !store.state.foundData.length )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getSearchResult ( force?: boolean ) {

    // .. re-tap situation
    if ( !force && tools.scapeCheck( "phrase" ) ) return;
    // tools.searchBoxResetter( true );

    // .. register action
    store.state.lastSearchedBy = "phrase";

    if ( force ) {
        // .. get Data
        let phrase = tools.inFarsiLetters( store.state.phraseInSearch );
        if ( store.state.searchSource === "Q" ) this.search_Q( phrase );
        if ( store.state.searchSource === "H" ) this.search_H( phrase );
    }

    if ( store.state.searchSource === "N" ) this.search_N();

}

// -- =====================================================================================

search_Q ( phrase: string ): void {

    let found: TS.FoundContent[] = [];

    for ( let i = 0; i < Quran.length; i++ )
        if ( tools.inFarsiLetters( Quran[i].simple ).includes( phrase ) )
            found.push( tools.contentPreviewer( "Q", i ) );

    store.state.foundData = found;
    store.state.foundDataSlot = "M1";

}

// -- =====================================================================================

search_H ( phrase: string ): void {

    let found: TS.FoundContent[] = [];

    for ( let i = 0; i < Hadith.length; i++ ) {

        // .. search in arabic text
        if ( tools.inFarsiLetters( Hadith[i].a ).includes( phrase ) )
            found.push( tools.contentPreviewer( "H", i ) );

        // // .. search in farsi text ( if exists )
        // else if ( Hadith[i].b )
        //     if ( tools.inFarsiLetters( Hadith[i].b ).includes( phrase ) )
        //         found.push( tools.contentPreviewer( "H", i ) );

    }

    store.state.foundData = found.filter( (x,i) => i<5 );
    store.state.foundDataSlot = "M1";

}

// -- =====================================================================================

search_N (): void {
    // this.$emit( 'search', str );
    store.state.foundData = [];
    store.state.foundDataSlot = null;
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .deactivate {
        visibility: collapse;
    }

</style>