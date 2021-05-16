<template>
<Page>
<GridLayout
    ref="fehrest"
    class="fehrest"
    rows="44,44,44,*,7"
    @tap="dismiss()"
>

<!---------------------------------------------------------------------------------------->

    <TextField row=2 ref="fakeSearch" opacity=0 />
    <TextField
        ref="search"
        row=2
        hint="بحث"
        class="search"
        @textChange="search()"
    />

    <Label
        row=2
        horizontalAlignment="left"
        :text="String.fromCharCode( '0x' + ( found.length ? 'f00d' : 'f002' ) )"
        @tap="found.length ? dismiss( true ) : search( true )"
        class="fas button" 
    />

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

    <GridLayout v-if=found.length class="result" row=3 >

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
import Ghertas                          from "@/components/00/Ghertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
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
frase = ""

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
    this.frase = ( this.$refs.search as any ).nativeView.text;
    // .. input must be unified!
    this.frase = this.frase.replace( /ی/g, 'ي' );
    this.frase = this.frase.replace( /ک/g, 'ك' );

    // .. reset asma
    this.asma = asma;
    this.found = [];

    // .. filter asma + unifying asma
    this.asma = this.asma.filter( x => tools.asmaUnifier( x[1] ).includes( this.frase ) );

    // .. search in ayat
    if ( this.frase.length > 2 || force ) {
        Quran.forEach( (q, i) => {
            if ( tools.asmaUnifier( q.simple ).includes( this.frase ) ) {
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