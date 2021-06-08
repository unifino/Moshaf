<template>

<!---------------------------------------------------------------------------------------->

    <Label
        class="fas button"
        :visibility="$store.state.search_ON ? 'visible' : 'collapsed'"
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
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Dismiss extends Vue {

// -- =====================================================================================

SearchPanel: SearchPanel = this.$parent as any; 
IntuitivePanel: IntuitivePanel;

// -- =====================================================================================

mounted () {
    this.IntuitivePanel = this.$parent.$parent as any;
    if ( !Object.keys( this.IntuitivePanel.$refs ).includes( "intuitivePanel" ) )
        this.IntuitivePanel = null;
}

// -- =====================================================================================

async dismiss () {
    // .. regular actions
    this.SearchPanel.display( null, null, true );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */

</style>