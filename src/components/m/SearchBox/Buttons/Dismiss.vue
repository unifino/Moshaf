<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f00d' )"
        @tap="dismiss()"
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

export default class Dismiss extends Vue {

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.foundData.length, 
        () => this.activeClass()
    );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = true,
        source = store.state.searchSource;

    if ( !store.state.foundData.length )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = false;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

async dismiss () {
    // .. patch M4|M3 intuitive
    if ( store.state.foundDataSlot === "M4" ) store.state.activeAyah = -1;
    if ( store.state.foundDataSlot === "M3" ) store.state.activeAyah = -1;
    // .. regular actions
    store.state.foundData = [];
    store.state.foundDataSlot = null;
    store.state.searchMode_Pr = null;
    await new Promise( _ => setTimeout( _, 10 ) );
    store.state.phraseInSearch = null;
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