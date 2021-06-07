<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f292' )"
        @tap="listRetriever()"
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

export default class HashTag extends Vue {

// -- =====================================================================================

@Prop() hashTagButton: boolean;

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
    this.myClass = this.hashTagButton ? 'activate' : 'deactivate';
}

// -- =====================================================================================

listRetriever () {

    // .. re-tap situation
    if ( this.SearchPanel.result.data.length ) {
        if ( store.state.foundDataSlot === "M2" ) {
            tools.clearSearchBox();
            return;
        }
    }

    // .. preparing
    tools.clearSearchBox();

    let rawTags = Object.keys( store.state.cakeBound ).filter( t => t.slice(0, 1) === "T" );

    store.state.foundDataSlot = "M2";
    let data = Object.values( rawTags ).map( (x, i) => { 
        return {
            id: i,
            text: x.slice(2),
            source: "T",
            flags: {
                count: tools.arabicDigits( store.state.cakeBound[x].length +'' ) as any
            }
        }
    } );
    // ! check this
    // this.SearchPanel.displayResult( data, "M2" )

    if ( !this.SearchPanel.result.data.length ) tools.toaster( "لم يتم العثور على شيء !" );

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