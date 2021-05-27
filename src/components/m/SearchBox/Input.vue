<template>
<GridLayout>

<!---------------------------------------------------------------------------------------->

    <TextField
        ref="search"
        :hint="hint + appendHint"
        class="search"
        @textChange="textChanged( $event.value )"
        @returnPress="returnPressed( $event.object.text )"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Input extends Vue {

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() hashTagButton: TS.Source;
@Prop() exchangeButton: TS.Source;

// -- =====================================================================================

hint: string = "بحث";

// -- =====================================================================================

get appendHint () {
    if ( this.source === "Q" ) return " في القرآن";
    if ( this.source === "H" ) return " في الحادیث";
    if ( this.source === "T" ) return " في العناوين";
    if ( this.source === "N" ) return " في النجاوى";
}

// -- =====================================================================================

mounted () {

    let pad = 140;
    if ( this.exchangeButton ) pad += 23;
    if ( this.hashTagButton  ) pad += 23;
    ( this.$refs.search as any ).nativeView.paddingLeft = pad;

    store.watch(
        state => store.state.phraseInSearch, 
        newVal => { if ( !newVal ) this.dismiss() }
    );

}

// -- =====================================================================================

textChanged ( phrase: string ) {
    store.state.phraseInSearch = phrase;
}

// -- =====================================================================================

returnPressed ( phrase: string ) {

    // .. Not in Tag-Section!
    if ( this.source !== "T" ) {
        store.state.forceSearchFuse = true;
        if ( phrase ) this.textChanged( phrase );
        else tools.searchBoxResetter();
    }

    // .. Just in Tag-Section
    else {

        // let newTag = phrase;

        // let a = "Q_" + store.state.activeAyah;
        // let b = "T_" + newTag;

        // // .. add new Tag ( uniqe )
        // if ( !store.state.bounds.find( x => x[0] === a && x[1] === b ) ) 
        //     store.state.bounds.push( [a, b] );

        // // .. hard registration
        // storage.saveDB( storage.bound_File, store.state.bounds );

        // // .. apply it
        // this.init( "rescan" );

    }

}

// -- =====================================================================================

dismiss () {
    store.state.phraseInSearch = null;
    ( this.$refs.search as any ).nativeView.text = null;
    ( this.$refs.search as any ).nativeView.dismissSoftInput();
    // ( this.$parent as any ).nativeView.focus();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .search {
        padding-left: 140;
        width: 100%;
    }

    .CoolGreen .search {
        color: #a8a8a8;
        placeholder-color: #8f875d;
    }

    .Smoky .search {
        color: #a8a8a8;
        placeholder-color: #8f875d;
    }

</style>