<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f2f1' )"
        @tap="exchange( false )"
        @longPress="exchange( true )"
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

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Exchange extends Vue {

// -- =====================================================================================

@Prop() exchangeButton: boolean;

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {
    // .. init
    this.activeClass();
}

// -- =====================================================================================

activeClass () {
    this.myClass = this.exchangeButton ? 'activate' : 'deactivate';
}

// -- =====================================================================================

exchange ( rev: boolean ) {

    switch ( store.state.searchSource ) {

        case "Q": store.state.searchSource = rev ? "T" : "H"; break;
        case "H": store.state.searchSource = rev ? "Q" : "T"; break;
        case "T": store.state.searchSource = rev ? "H" : "Q"; break;

        // case "Q": store.state.searchSource = rev ? "T" : "H"; break;
        // case "H": store.state.searchSource = rev ? "Q" : "N"; break;
        // case "N": store.state.searchSource = rev ? "H" : "T"; break;
        // case "T": store.state.searchSource = rev ? "N" : "Q"; break;

    }

    const S = store.state.searchSource;

    if ( S === "Q" || S === "H" /*|| S === "N"*/ ) {

        // .. reload Data
        switch ( store.state.searchMode_Pr ) {
            case "history" : store.state.foundData = tools.getHistory();      break;
            case "favorite": store.state.foundData = tools.getFavorite();     break;
            case "phrase"  : 
                let phrase = tools.inFarsiLetters( store.state.phraseInSearch ).trim();
                store.state.foundData = tools[ "search_" +S ]( phrase ); 
            break;
        }

    }
    else tools.searchBoxResetter();

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