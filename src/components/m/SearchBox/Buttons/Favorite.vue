<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f004' )"
        @tap="getFavorite()"
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

export default class Favorite extends Vue {

// -- =====================================================================================

@Prop() source: TS.Source;

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {

    store.watch(
        state => state.fav.Q.length + state.fav.H.length, 
        () => this.activeClass()
    );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false;

    if ( this.source === "Q" ) if ( store.state.fav.Q.length ) activeClass = true;
    if ( this.source === "H" ) if ( store.state.fav.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getFavorite ( escape?: boolean ) {

    // .. re-tap situation
    if ( !escape && tools.scapeCheck( "favorite" ) ) return;

    // .. register action
    store.state.lastSearchedBy = "favorite";

    let found: TS.FoundContent[] = [];

    for ( const m of store.state.fav[ this.source ] ) 
        found.unshift( tools.contentPreviewer( this.source, m ) )

    store.state.foundData = found;

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