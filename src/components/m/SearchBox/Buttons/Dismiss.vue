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

@Prop() source: TS.Source;

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
    let activeClass = true;

    if ( !store.state.foundData.length )
        if ( this.source ==='Q' || this.source ==='H' || this.source ==='N' ) 
            activeClass = false;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

async dismiss () {
    store.state.foundData = [];
    store.state.lastSearchedBy = null;
    await new Promise( _ => setTimeout( _, 10 ) );
    store.state.phraseInSearch = null;
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .deactivate {
        visibility: collapse;
    }

</style>