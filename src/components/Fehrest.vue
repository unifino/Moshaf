<template>
<Page>
<GridLayout
    ref="fehrest"
    class="fehrest"
    rows="44,44,44,*,7"
    columns="auto,*"
    @tap="dismiss()"
>

<!---------------------------------------------------------------------------------------->

    <TextField row=2 ref="fakeSearch" opacity=0 />
    <TextField
        ref="search"
        row=2
        colSpan=2
        hint="بحث"
        class="search"
        @textChange="search()"
    />

    <Label
        row=2
        :text="String.fromCharCode( '0x' + ( found.length ? 'f00d' : 'f002' ) )"
        @tap="found.length ? dismiss( true ) : search( true )"
        class="fas button" 
    />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        rowSpan=3
        colSpan=2
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

    <GridLayout
        v-if=found.length
        class="result"
        row=3
        colSpan=2
    >

        <ListView for="item in found" >
            <v-template>
                <Label
                    :text="item.text"
                    textWrap=true
                    class="item"
                    @tap="open(item.idx)" 
                />
            </v-template>
        </ListView>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Ghertas                          from "@/components/Ghertas.vue"
import Kalameh                          from "@/components/Kalameh.vue"
import { asma, Quran }                  from "@/db/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Ghertas }
} )

// -- =====================================================================================

export default class Fehrest extends Vue {

// -- =====================================================================================

asma = asma;
found = [];

// -- =====================================================================================

mounted () {
    store.state.here = "Fehrest";
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
    let text = ( this.$refs.search as any ).nativeView.text;
    // .. input must be unified!
    text = text.replace( /ی/g, 'ي' );
    text = text.replace( /ک/g, 'ك' );

    // .. reset asma
    this.asma = asma;
    this.found = [];

    // .. filter asma + unifying asma
    this.asma = this.asma.filter( x => tools.asmaUnifier( x[1] ).includes( text ) );

    // .. search in ayat
    if ( text.length > 2 || force ) {
        Quran.forEach( (q, i) => {
            if ( tools.asmaUnifier( q.simple ).includes( text ) ) {
                this.found.push( { text: q.simple, idx: i } );
            }
        } );
    }

}

// -- =====================================================================================

dismiss ( force=false ) {
    if ( force ) ( this.$refs.search as any ).nativeView.text = "";
    ( this.$refs.search as any ).nativeView.dismissSoftInput();
    ( this.$refs.fakeSearch as any ).nativeView.focus();
    ( this.$refs.fakeSearch as any ).nativeView.dismissSoftInput();
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
    .fehrest {
        padding: 0 48%;
    }

    .sura, .saat {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 14;
        padding: 0 3;
        margin: 0 .5;
    }

    .saat {
        background-color: #07301d;
        border-radius: 5;
    }

    .search {
        color: white;
        placeholder-color: #57554a;
        border-bottom-width: 1;
        border-color: #726d4f; 
        color: #a8a8a8;
    }

    .result {
        background-color: #0f1616;
        padding: 20 24;
        margin-bottom: 44;
        border-radius: 0 0 7 7;
    }

    .item {
        font-family: Amiri-Regular;
        font-family: 12;
        color: #888888;
        padding: 10;
    }

    .button {
        color: #727779;
        font-size: 20;
        width: 44;
        height: 44;
        padding: 10 5;
    }

</style>