<template>

<!---------------------------------------------------------------------------------------->

    <Label
        class="fas button"
        :visibility="visibility"
        :text="String.fromCharCode( '0x' + 'f00d' )"
        @tap="dismiss()"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
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

get visibility () {

    let source = this.SearchPanel.activeMode,
        visible = false;

    if ( this.SearchPanel.activated )
        if ( source ==='Q' || source ==='H' || source ==='N' ) 
            visible = true;

    if ( source === "T" ) visible = true;

    return visible ? 'visible' : 'collapsed';

}

// -- =====================================================================================

async dismiss () {
    // .. regular actions
    this.SearchPanel.display( null, null, null, true );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */

</style>