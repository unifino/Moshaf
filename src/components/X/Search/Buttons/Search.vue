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
        source = this.SearchPanel.activeMode;

    if ( store.state.search_ON )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = false;

    return activeClass ? 'visible' : 'collapsed';

}

// -- =====================================================================================

getSearchResult ( force?: boolean ) {

    // .. Tag Mode
    if ( this.SearchPanel.activeMode === "T" ) return;

    // .. re-tap situation
    if ( !force && store.state.search_ON && store.state.search_CH === "phrase" ) {
        this.SearchPanel.display( null, null, true );
        return;
    }

    // .. register action
    store.state.search_CH = "phrase";

    if ( force ) {
        let str = (<any>this.SearchPanel.$refs.input).$refs.textField.nativeView.text || "";
        let data = tools.getPhrase( this.SearchPanel.activeMode, str );
        this.SearchPanel.display(  data, "List_1" );
    }

    if ( this.SearchPanel.activeMode === "N" ) this.search_N();

    if ( !store.state.search_ON ) tools.toaster( "لم يتم العثور على شيء !" );

}

// -- =====================================================================================

search_N (): void {
    // this.$emit( 'search', str );
    this.SearchPanel.display( null, null, true );
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