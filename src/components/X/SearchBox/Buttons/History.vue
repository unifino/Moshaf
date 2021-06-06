<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f1da' )"
        @tap="getHistory()"
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

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class History extends Vue {

// -- =====================================================================================

myClass = "";
life = true;

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.search_IN, 
        () => { if ( this.life ) this.activeClass() }
    );

    // .. init
    this.activeClass();

}

// -- =====================================================================================

activeClass () {

    // .. reset Class
    let activeClass = false,
        source = store.state.search_IN;

    if ( source === "Q" ) if ( store.state.memo.Q.length ) activeClass = true;
    if ( source === "H" ) if ( store.state.memo.H.length ) activeClass = true;

    this.myClass = activeClass ? 'activate' : 'deactivate';

}

// -- =====================================================================================

getHistory () {

    // .. re-tap situation
    if ( tools.scapeCheck( "history" ) ) return;
    tools.clearSearchBox();

    // .. register action
    store.state.searched_By = "history";

    store.state.foundData = tools.getHistory();
    store.state.foundDataSlot = "M1";

    if ( !store.state.foundData.length ) tools.toaster( "لم يتم العثور على شيء !" );

}

// -- =====================================================================================

purgeHistory () {

    // .. get Name
    let src = store.state.search_IN;
    let traceName = 'trace_' + src.toLowerCase();

    // .. soft Purge
    store.state.memo[ src ].splice(0);
    // .. hard registration
    storage.saveDB( storage[ traceName + "_File" ], store.state.memo[ src ] );

    // .. notify
    tools.toaster( "🗑: History Purged!" );

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