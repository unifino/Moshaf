<template>

<!---------------------------------------------------------------------------------------->

    <Label
        class="fas button"
        :visibility=visibility 
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
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";
import { type } from "node:os";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Search extends Vue {

// -- =====================================================================================

SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

get visibility () {

    // .. reset Class
    let activeClass = true,
        source = store.state.search_IN;

    if ( store.state.search_ON )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = false;

    return activeClass ? 'visible' : 'collapsed';

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
        let str = "";
        try { str = store.state.fraseInSearch.trim() } catch {}
        let data = tools.getPhrase( store.state.search_IN, str );
        this.SearchPanel.display(  data, "List_1" );
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