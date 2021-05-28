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
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

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
        source = store.state.search_IN;

    if ( !store.state.foundData.length )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getSearchResult ( force?: boolean ) {

    // .. Tag Mode
    if ( store.state.search_IN === "T" ) return;

    // .. re-tap situation
    if ( !force && tools.scapeCheck( "phrase" ) ) return;
    // tools.searchBoxResetter( true );

    // .. register action
    store.state.searched_By = "phrase";

    if ( force ) {
        // .. get Data
        let phrase = tools.inFarsiLetters( store.state.phraseInSearch ).trim();
        switch ( store.state.search_IN ) {
            case "Q": store.state.foundData = tools.search_Q( phrase ); break;
            case "H": store.state.foundData = tools.search_H( phrase ); break;
        }
        store.state.foundDataSlot = "M1";
    }

    if ( store.state.search_IN === "N" ) this.search_N();

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