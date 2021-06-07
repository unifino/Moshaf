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
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import SearchPanel                      from "../Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Favorite extends Vue {

// -- =====================================================================================

myClass = "";
SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false,
        source = store.state.search_IN;

    if ( source === "Q" ) if ( store.state.fav.Q.length ) activeClass = true;
    if ( source === "H" ) if ( store.state.fav.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getFavorite () {

    // .. re-tap situation
    if ( store.state.search_ON && store.state.search_CH === "favorite" ) {
        this.SearchPanel.clearSearch();
        return;
    }

    // .. register action
    store.state.search_CH = "favorite";

    this.SearchPanel.display( tools.getFavorite(), "List_1" );

    store.state.foundDataSlot = "M1";

    if ( !store.state.search_ON ) tools.toaster( "لم يتم العثور على شيء !" );

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