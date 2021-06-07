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
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import SearchPanel                      from "../Search_Panel.vue";

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
SearchPanel: SearchPanel = this.$parent as any; 

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

        case "Q": store.state.search_IN = rev ? "H" : "H"; break;
        case "H": store.state.search_IN = rev ? "Q" : "Q"; break;
        case "T": store.state.search_IN = rev ? "H" : "Q"; break;

        // case "Q": store.state.search_IN = rev ? "T" : "H"; break;
        // case "H": store.state.search_IN = rev ? "Q" : "T"; break;
        // case "T": store.state.search_IN = rev ? "H" : "Q"; break;

        // case "Q": store.state.search_IN = rev ? "T" : "H"; break;
        // case "H": store.state.search_IN = rev ? "Q" : "N"; break;
        // case "N": store.state.search_IN = rev ? "H" : "T"; break;
        // case "T": store.state.search_IN = rev ? "N" : "Q"; break;

    }

    const S = store.state.search_IN;
    let str: string = "";
    try { str = store.state.fraseInSearch.trim() } catch {}

    switch ( S ) {

        case "Q":
        case "H":
            store.state.foundDataSlot = "M1";
            // ! Check it
            // switch ( store.state.searched_By ) {
            //     case "history" : this.SearchPanel.displayResult( tools.getHistory(), "M1"); break;
            //     case "favorite": this.SearchPanel.displayResult( tools.getFavorite(), "M1"); break;
            //     case "phrase"  : 
            //         if ( str )  this.SearchPanel.displayResult( tools[ "search_" +S ](str), "M1") ;
            //         else store.state.foundDataSlot = null;
            //     break;

            //     default: store.state.foundDataSlot = null; break;
            // }
        break;

        // case "T":
        //     store.state.foundDataSlot = "M3";
        //     store.state.foundData = tools.getTags();
        // break;

        case "N": tools.clearSearchBox(); break;

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