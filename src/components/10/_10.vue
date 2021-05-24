<template>
<Page>
<GridLayout class="myPage" rows="44,44,44,*,7" @tap="search_dismiss()">

<!---------------------------------------------------------------------------------------->

    <Day row=3 rowSpan=3 />

<!---------------------------------------------------------------------------------------->

    <SearchBox 
        row=2
        rowSpan=2
        ref="search"
        @search="search"
        @history="history"
        @favorite="favorite"
        @open="open"
        hint="بحث في الحادیث"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Ghertas                          from "@/components/00/Ghertas.vue"
import { ahadis }                       from "@/db/H/Ahadis"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox.vue"
import Day                              from "@/components/10/Day.vue"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: { SearchBox, Day }
} )

// -- =====================================================================================

export default class Base_10 extends Vue {

// -- =====================================================================================

swipePass;

// -- =====================================================================================

mounted () {
    store.state.here = "Hadis";
}

// -- =====================================================================================

open ( num: number ): void {


    Vue.prototype.$navigateTo( Ghertas, {

        frame : "base",

        backstackVisible : true,

        props : {
            me : num,
        },

        transition : {
            name         : "slideTop",
            duration     : 300,
        }

    } );

}

// -- =====================================================================================

search ( force=false ) {

    // let text = event.object.text;
    let phrase = ( this.$refs.search as any ).nativeView.text;
    // .. input must be unified!
    phrase = phrase.replace( /ی/g, 'ي' );
    phrase = phrase.replace( /ک/g, 'ك' );
    phrase = tools.erabTrimmer( phrase );

    // .. reset
    let found: TS.Found = [];

    // .. search in ahadis
    if ( phrase.length > 2 || force )
        for ( const i in ahadis )
            if ( tools.asmaUnifier( tools.erabTrimmer( ahadis[i].a ) ).includes( phrase ) )
                found.push( { text: ahadis[i].a, idx: Number(i) } );

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

history () {

    let found: TS.Found = [];

    for ( const h of storage.trace_h ) {
        const ref = ahadis[ h.hadis ];
        if ( ref ) found.unshift( { text: ref.a, idx: h.hadis } );
    }

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

favorite () {

    let found: TS.Found = [];

    for ( const f of storage.fav_h ) {
        const ref = ahadis[ f ];
        found.unshift( { text: ref.a, idx: f } );
    }

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

search_dismiss () {
    ( this.$refs.search as SearchBox ).dismiss();
}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .myPage {
        width: 300;
    }

</style>