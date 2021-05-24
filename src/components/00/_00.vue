<template>
<Page>
<GridLayout
    ref="fehrest"
    class="fehrest"
    rows="44,44,44,*,7"
    @tap="search_dismiss()"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        rowSpan=3
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

<!---------------------------------------------------------------------------------------->

        <FlexboxLayout
            ref="fehrest"
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-around"
            alignItems="center"
        >
            <Label
                v-for="(x,i) in asma"
                :key=i
                :ref="i"
                :text=x[1]
                class="sura"
                @tap="open(x[2])"
            />
            <Label
                ref="-1"
                text="صاحب‌الزمان"
                class="saat"
                @tap="open(-1)"
            />
        </FlexboxLayout>

<!---------------------------------------------------------------------------------------->

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <SearchBox 
        row=2
        rowSpan=2
        ref="search"
        @search="search"
        @history="history"
        @favorite="favorite"
        @open="open"
        hint="بحث في القرآن"
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
import Kalameh                          from "@/components/m/Kalameh.vue"
import { asma, Quran }                  from "@/db/Q/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox.vue"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Ghertas, SearchBox }
} )

// -- =====================================================================================

export default class Base_00 extends Vue {

// -- =====================================================================================

asma = asma;
phrase = ""

// -- =====================================================================================

mounted () {
    store.state.here = "Base_00";
}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Ghertas, {

        frame : "base",
        props : { me : num },
        backstackVisible : true,
        transition : { name: "slideTop", duration: 300 }

    } );

}

// -- =====================================================================================

search ( phrase: string, force=false ) {

    // .. input must be unified!
    phrase = phrase.replace( /ی/g, 'ي' );
    phrase = phrase.replace( /ک/g, 'ك' );

    // .. reset asma
    this.asma = asma;
    let found: TS.Found = [];

    // .. filter asma + unifying asma
    this.asma = this.asma.filter( x => tools.asmaUnifier( x[1] ).includes( phrase ) );

    // .. search in ayat
    if ( phrase.length > 2 || force )
        for ( const i in Quran )
            if ( tools.asmaUnifier( Quran[i].simple ).includes( phrase ) )
                found.push( { text: tools.textPreviwer( Number(i) ), idx: Number(i) } );

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

history () {

    let found: TS.Found = [];

    for ( const h of storage.trace_q )
        found.unshift( { text: tools.textPreviwer( h.ayah ), idx: h.ayah } );

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

favorite () {

    let found: TS.Found = [];

    for ( const f of storage.fav_q )
        found.unshift( { text: tools.textPreviwer( f ), idx: f } );

    ( this.$refs.search as SearchBox ).init( found );

}

// -- =====================================================================================

search_dismiss () {
    ( this.$refs.search as SearchBox ).dismiss();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .fehrest {
        width: 300;
    }

    .sura, .saat {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 14;
        padding: -4 3 0 3;
        margin: 2 .5;
        height: 35;
        border-radius: 5;
    }

    .CoolGreen .sura {
        color: #cccccc;
    }

    .Smoky .sura {
        color: #222324;
    }

    .CoolGreen .saat {
        background-color: #498c29;
        background-color: #086439;
        color: #cccccc;
    }

    .Smoky .saat {
        background-color: #75aa1f;
        color: #eeeeee;
    }

    .DarkGreen .saat {
        background-color: #2c3007;
        color: #cccccc;
    }

</style>