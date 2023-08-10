<template>

<!---------------------------------------------------------------------------------------->

    <Label
        class="fas button"
        :visibility=visibility 
        :text="String.fromCharCode( '0x' + 'f002' )"
        @tap="getResult( true )"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as tools                       from "@/mixins/tools"
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

    let source = this.SearchPanel.activeMode,
        visible = true;

    if ( this.SearchPanel.activated )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            visible = false;

    if ( source === "T" ) visible = false;

    return visible ? 'visible' : 'collapsed';

}

// -- =====================================================================================

getResult ( force?: boolean ) {

    // .. Tag Mode
    if ( this.SearchPanel.activeMode === "T" ) return;

    // .. re-tap situation
    if ( !force && this.SearchPanel.search_CH === "phrase" ) {
        this.SearchPanel.display_RESET();
        return;
    }

    // .. patch for T mode
    let src = this.SearchPanel.activeMode;
    if ( src !== "Q" && src !== "H" )
        this.SearchPanel.activeMode = this.SearchPanel.defaultActiveMode;

    if ( force ) {
        let str = (<any>this.SearchPanel.$refs.input).$refs.textField.nativeView.text || "";
        let data = tools.getPhrase( this.SearchPanel.activeMode, str );
        this.SearchPanel.display_ON( data, "List_1", "phrase" );
        if ( !data.length ) tools.toaster( "لم يتم العثور على شيء !" );
    }

    if ( this.SearchPanel.activeMode === "N" ) this.search_N();

}

// -- =====================================================================================

search_N (): void {
    // this.$emit( 'search', str );
    this.SearchPanel.display_RESET();
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