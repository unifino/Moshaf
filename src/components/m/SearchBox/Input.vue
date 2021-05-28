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
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Input extends Vue {

// -- =====================================================================================

@Prop() hashTagButton: TS.Source;
@Prop() exchangeButton: TS.Source;

// -- =====================================================================================

hint: string = "بحث";

// -- =====================================================================================

get appendHint () {
    if ( store.state.search_IN === "Q" ) return " في القرآن";
    if ( store.state.search_IN === "H" ) return " في الحادیث";
    if ( store.state.search_IN === "T" ) return " في العناوين";
    if ( store.state.search_IN === "N" ) return " في النجاوى";
}

// -- =====================================================================================

mounted () {

    let pad = 140;
    if ( this.exchangeButton ) pad += 23;
    if ( this.hashTagButton  ) pad += 23;
    try { ( this.$refs.search as any ).nativeView.paddingLeft = pad } catch {}

    store.watch(
        state => store.state.phraseInSearch, 
        newVal => { if ( !newVal ) this.dismiss() }
    );

}

// -- =====================================================================================

textChanged ( phrase: string, force?: boolean ) {
    if ( force ) while ( phrase.length < 4 ) phrase = " " + phrase;
    store.state.phraseInSearch = phrase;
}

// -- =====================================================================================

returnPressed ( phrase: string ) {

    // .. Not in Tag-Section!
    if ( store.state.search_IN !== "T" ) {
        if ( phrase ) this.textChanged( phrase, true );
        else tools.searchBoxResetter();
    }

    // .. Just in Tag-Section
    else {

        let text = tools.inFarsiLetters( phrase ),
            newTag: TS.FoundContent = { text: text, id: -1, source: "T", flags: {} };

        if ( text ) {
            tools.bound_Q_Toggler( newTag );
            store.state.foundDataSlot = "M3";
            store.state.foundData = tools.getTags();
        }

        // .. hard registration
        storage.saveDB( storage.bound_File, storage.rawBound );

    }

}

// -- =====================================================================================

dismiss () {
    store.state.phraseInSearch = null;
    try { ( this.$refs.search as any ).nativeView.text = null } catch {}
    try { ( this.$refs.search as any ).nativeView.dismissSoftInput() } catch {}
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