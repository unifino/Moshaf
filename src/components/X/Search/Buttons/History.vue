<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f1da' )"
        @tap="getResult()"
        @longPress="purgeHistory()"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class History extends Vue {

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

    if ( source === "Q" ) if ( store.state.memo.Q.length ) activeClass = true;
    if ( source === "H" ) if ( store.state.memo.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getResult () {

    // .. re-tap situation
    if ( this.SearchPanel.search_CH === "history" ) {
        this.SearchPanel.display_RESET();
        return;
    }

    // .. patch for T mode
    let src = this.SearchPanel.activeMode;
    if ( src !== "Q" && src !== "H" ) 
        this.SearchPanel.activeMode = this.SearchPanel.defaultActiveMode;

    let data = tools.getHistory( this.SearchPanel.activeMode );
    this.SearchPanel.display_ON( data, "List_1", "history" );

    if ( !data.length ) tools.toaster( "لم يتم العثور على شيء !" );

}

// -- =====================================================================================

purgeHistory () {

    // .. get Name
    let source = this.SearchPanel.activeMode;
    let traceName = 'trace_' + source.toLowerCase();

    // .. soft Purge
    store.state.memo[ source ].splice(0);
    // .. hard registration
    storage.saveDB( storage[ traceName + "_File" ], store.state.memo[ source ] );

    // .. notify
    tools.toaster( "🗑: History Purged!" );

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