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
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

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
        source = this.SearchPanel.activeMode;

    if ( source === "Q" ) if ( store.state.fav.Q.length ) activeClass = true;
    if ( source === "H" ) if ( store.state.fav.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getFavorite () {

    // .. re-tap situation
    if ( this.SearchPanel.search_CH === "favorite" ) {
        this.SearchPanel.display( null, null, true );
        return;
    }

    // .. register action
    this.SearchPanel.search_CH = "favorite";
    let source = this.SearchPanel.activeMode;

    let data = tools.getFavorite( source );
    this.SearchPanel.display( data, "List_1" );

    if ( !data.length ) tools.toaster( "لم يتم العثور على شيء !" );

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