<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f292' )"
        @tap="listRetriever()"
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

export default class HashTag extends Vue {

// -- =====================================================================================

@Prop() hashTagButton: boolean;

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {
    // .. init
    this.activeClass();
}

// -- =====================================================================================

activeClass () {
    this.myClass = this.hashTagButton ? 'activate' : 'deactivate';
}

// -- =====================================================================================

listRetriever () {

    // .. re-tap situation
    if ( store.state.foundData.length ) {
        if ( store.state.foundDataSlot === "M2" ) {
            tools.searchBoxResetter();
            return;
        }
    }

    // .. preparing
    tools.searchBoxResetter();

    let rawTags = Object.keys( store.state.cakeBound ).filter( t => t.slice(0, 1) === "T" );

    store.state.foundDataSlot = "M2";
    store.state.foundData = Object.values( rawTags ).map( (x, i) => { 
        return {
            id: i,
            text: x.slice(2),
            source: "T",
            flags: {
                count: tools.arabicDigits( store.state.cakeBound[x].length +'' ) as any
            }
        }
    } );

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