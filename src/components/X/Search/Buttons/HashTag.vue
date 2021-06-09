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
import * as TS                          from "@/../types/myTypes"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

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
    if ( this.SearchPanel.search_CH === "tag" ) {
        this.SearchPanel.display( null, null, true );
        return;
    }

    // .. register chanel
    this.SearchPanel.search_CH = "tag";

    let rawTags = Object.keys( store.state.cakeBound ).filter( t => t.slice(0, 1) === "T" );

    let data: TS.ItemFound[] = Object.values( rawTags ).map( (x, i) => { 
        return {
            id: i,
            text: x.slice(2),
            source: "T",
            flags: {
                count: tools.arabicDigits( store.state.cakeBound[x].length +'' ) as any
            }
        }
    } );
    this.SearchPanel.display( data, "List_2" );

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