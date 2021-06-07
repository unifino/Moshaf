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

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Favorite extends Vue {

// -- =====================================================================================

myClass = "";
life = true;

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
    if ( tools.scapeCheck( "favorite" ) ) return;
    tools.clearSearchBox();

    // .. register action
    store.state.searched_By = "favorite";

    store.state.foundData = tools.getFavorite();
    store.state.foundDataSlot = "M1";

    if ( !store.state.foundData.length ) tools.toaster( "لم يتم العثور على شيء !" );

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