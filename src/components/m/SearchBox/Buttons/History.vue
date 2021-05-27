<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f1da' )"
        @tap="getHistory()"
        @longPress="purgeHistory()"
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

export default class History extends Vue {

// -- =====================================================================================

@Prop() source: TS.Source;

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {

    store.watch(
        state => state.memo.Q.length + state.memo.H.length, 
        () => this.activeClass()
    );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false;

    if ( this.source === "Q" ) if ( store.state.memo.Q.length ) activeClass = true;
    if ( this.source === "H" ) if ( store.state.memo.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getHistory () {

    // .. re-tap situation
    if ( tools.scapeCheck( "history" ) ) return;
    tools.searchBoxResetter();

    // .. register action
    store.state.lastSearchedBy = "history";

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.memo[ this.source ] ) 
        found.unshift( tools.contentPreviewer( this.source, m ) )

    store.state.foundData = found;
    store.state.foundDataSlot = "M1";

}

// -- =====================================================================================

purgeHistory () {
    // .. get Name
    let traceName = 'trace_' + this.source.toLowerCase();
    // .. soft Purge
    store.state.memo.Q.splice(0);
    // .. hard registration
    storage.saveDB( storage[ traceName + "_File" ], store.state.memo.Q );
    // .. notify
    tools.toaster( "🗑: History Purged!" );
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