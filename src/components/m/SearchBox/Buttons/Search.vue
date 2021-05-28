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

@Prop() searchLock: boolean;

// -- =====================================================================================

myClass = "";
life = true;

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.foundData.length,
        () => { if ( this.life ) this.activeClass() }
    );

    store.watch(
        state => store.state.fraseInSearch, 
        ( newVal, oldVal ) => {
            if ( this.life && !this.searchLock )
               if ( newVal && ( newVal !== oldVal ) )
                    this.getSearchResult( newVal.length > 3 );
        }
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

    // .. register action
    store.state.searched_By = "phrase";

    if ( force ) {
        let str = store.state.fraseInSearch.trim();
        switch ( store.state.search_IN ) {
            case "Q": store.state.foundData = tools.search_Q( str ); break;
            case "H": store.state.foundData = tools.search_H( str ); break;
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

destroyed () {
    this.life = false;
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