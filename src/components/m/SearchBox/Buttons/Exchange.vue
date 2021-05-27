<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f2f1' )"
        @tap="exchange()"
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

exchange () {

    switch ( store.state.searchSource ) {

        case "Q": store.state.searchSource = "H"; break;
        case "H": store.state.searchSource = "T"; break;
        // case "T": store.state.searchSource = "N"; break;
        // case "N": store.state.searchSource = "Q"; break;
        case "T": store.state.searchSource = "Q"; break;

    }

    if ( store.state.searchSource === "Q" || store.state.searchSource === "H" ) {

        // .. reload Data
        switch ( store.state.searchMode_Pr ) {
            case "history": store.state.foundData = tools.getHistory(); break;
            case "favorite": store.state.foundData = tools.getFavorite(); break;
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