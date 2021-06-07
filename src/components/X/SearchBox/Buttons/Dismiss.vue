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
import store                            from "@/store/store"
import * as tools                       from "@/mixins/tools"
import SearchPanel                      from "../Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Dismiss extends Vue {

// -- =====================================================================================

myClass = "";
SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = true,
        source = store.state.search_IN;

    if ( store.state.search_ON )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            activeClass = false;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

async dismiss () {
    // ! check this
    // // .. patch M4|M3 intuitive
    // if ( store.state.foundDataSlot === "M4" ) store.state.activeAyah = -1;
    // if ( store.state.foundDataSlot === "M3" ) store.state.activeAyah = -1;
    // .. regular actions
    tools.clearSearchBox( true );
    await new Promise( _ => setTimeout( _, 10 ) );
    tools.clearSearchBox( false );
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