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

    switch ( store.state.search_IN ) {

        case "Q": store.state.search_IN = rev ? "T" : "H"; break;
        case "H": store.state.search_IN = rev ? "Q" : "T"; break;
        case "T": store.state.search_IN = rev ? "H" : "Q"; break;

        // case "Q": store.state.search_IN = rev ? "T" : "H"; break;
        // case "H": store.state.search_IN = rev ? "Q" : "N"; break;
        // case "N": store.state.search_IN = rev ? "H" : "T"; break;
        // case "T": store.state.search_IN = rev ? "N" : "Q"; break;

    }

    const S = store.state.search_IN;
    let frase: string = "";
    try { frase = tools.inFarsiLetters( store.state.phraseInSearch ).trim() } catch {}

    switch ( S ) {

        case "Q":
        case "H":
            store.state.foundDataSlot = "M1";
            switch ( store.state.searched_By ) {
                case "history" : store.state.foundData = tools.getHistory();    break;
                case "favorite": store.state.foundData = tools.getFavorite();   break;
                case "phrase"  : 
                    if ( frase ) store.state.foundData = tools[ "search_" +S ](frase);
                    else store.state.foundDataSlot = null;
                break;

                default: store.state.foundDataSlot = null; break;
            }
        break;

        case "T":
            store.state.foundDataSlot = "M3";
            store.state.foundData = tools.getTags();
        break;

        case "N": tools.searchBoxResetter(); break;

    }

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