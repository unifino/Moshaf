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
import SearchPanel                      from "../Search_Panel.vue";
import { type } from "node:os";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Search extends Vue {

// -- =====================================================================================

myClass = "";
SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {

    // ! check this
    // store.watch(
    //     state => store.state.fraseInSearch, 
    //     ( newVal, oldVal ) => {
    //         if ( this.life && !this.searchLock )
    //            if ( newVal && ( newVal !== oldVal ) )
    //                 this.getSearchResult( newVal.length > 3 );
    //     }
    // );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false,
        source = store.state.search_IN;

    if ( !store.state.search_ON )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getSearchResult ( force?: boolean ) {

    // .. Tag Mode
    if ( store.state.search_IN === "T" ) return;

    // .. re-tap situation
    if ( !force && store.state.search_ON && store.state.search_CH === "phrase" ) {
        this.SearchPanel.clearSearch();
        return;
    }

    // .. register action
    store.state.search_CH = "phrase";

    if ( force ) {
        let str = store.state.fraseInSearch.trim();
        let data = tools[ "search_" + store.state.search_IN ]( str );
        this.SearchPanel.display(  data, "List_1");
    }

    if ( store.state.search_IN === "N" ) this.search_N();

    if ( !store.state.search_ON ) tools.toaster( "لم يتم العثور على شيء !" );

}

// -- =====================================================================================

search_N (): void {
    // this.$emit( 'search', str );
    this.SearchPanel.clearSearch();
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