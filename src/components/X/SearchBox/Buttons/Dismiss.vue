<template>

<!---------------------------------------------------------------------------------------->

    <Label
        class="fas button"
        :visibility=visibility 
        :text="String.fromCharCode( '0x' + 'f00d' )"
        @tap="dismiss()"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import store                            from "@/store/store"
import * as tools                       from "@/mixins/tools"
import SearchPanel                      from "@/components/X/SearchBox/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Dismiss extends Vue {

// -- =====================================================================================

SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

get visibility () {

    // .. reset Class
    let activeClass = false,
        source = store.state.search_IN;

    if ( store.state.search_ON )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = true;

    return activeClass ? 'visible' : 'collapsed';

}

// -- =====================================================================================

async dismiss () {
    // ! check this
    // // .. patch M4|M3 intuitive
    // if ( store.state.foundDataSlot === "M4" ) store.state.activeAyah = -1;
    // if ( store.state.foundDataSlot === "M3" ) store.state.activeAyah = -1;
    // await new Promise( _ => setTimeout( _, 10 ) );
    // tools.clearSearchBox( false );
    // .. regular actions
    this.SearchPanel.clearSearch();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */

</style>