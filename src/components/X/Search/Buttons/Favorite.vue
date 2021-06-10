<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass"
        :text="String.fromCharCode( '0x' + 'f004' )"
        @tap="getResult()"
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

getResult () {

    // .. re-tap situation
    if ( this.SearchPanel.search_CH === "favorite" ) {
        this.SearchPanel.display_RESET();
        return;
    }

    // .. patch for T mode
    let src = this.SearchPanel.activeMode;
    if ( src !== "Q" && src !== "H" ) 
        this.SearchPanel.activeMode = this.SearchPanel.defaultActiveMode;

    let data = tools.getFavorite( this.SearchPanel.activeMode );
    this.SearchPanel.display_ON( data, "List_1", "favorite" );

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