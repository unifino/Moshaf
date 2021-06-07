<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass"
        :visibility="$store.state.search_ON ? 'visible' : 'collapsed'"
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

mounted () {}

// -- =====================================================================================

getFavorite () {

    // .. re-tap situation
    if ( store.state.search_ON && store.state.search_CH === "favorite" ) {
        this.SearchPanel.clearSearch();
        return;
    }

    // .. register action
    store.state.search_CH = "favorite";

    this.SearchPanel.display( tools.getFavorite( store.state.search_IN ), "List_1" );

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