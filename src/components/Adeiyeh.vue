<template>
<Page>
<GridLayout class="myPage" rows="44,44,44,*,3*,*,7" >

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
        @longPress="popLastTrace()"
        class="fas button" 
    />

<!---------------------------------------------------------------------------------------->

    <ListView row=4 for="(doa, idx) in adeiyeh" >
        <v-template>
            <Label
                :text="doa.title"
                textWrap=true
                class="doa"
                @tap="open( idx )" 
            />
        </v-template>
    </ListView>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Doa                              from "@/components/Doa.vue"
import Kalameh                          from "@/components/Kalameh.vue"
import { adeiyeh }                      from "@/db/Adeiyeh"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"

// -- =====================================================================================

@Component ( {
    components: { Doa }
} )

// -- =====================================================================================

export default class Adeiyeh extends Vue {

// -- =====================================================================================

adeiyeh: { title: string, content: string }[] = [];
found = [];

// -- =====================================================================================

mounted () {
    store.state.here = "Adeiyeh";
    this.adeiyeh = adeiyeh;
}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Doa, {

        frame : "base",

        backstackVisible : true,

        props : {
            doaID : num,
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
    text = tools.erabTrimmer( text );

    // .. reset
    this.adeiyeh = [];

    // .. search in ayat
    if ( text.length > 2 || force ) {
        // collection.forEach( (q, i) => {
        //     if ( tools.asmaUnifier( tools.erabTrimmer( q.a || "" ) ).includes( text ) )
        //         this.adeiyeh.push( { text: q.a, idx: i } );
        //     if ( tools.asmaUnifier( q.b ).includes( text ) )
        //         this.adeiyeh.push( { text: q.b, idx: i } );
        // } );
    }

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

    .doa {
        margin: 20;
        font-family: JF Flat;
        text-align: center;
        font-size: 16;
    }

    .CoolGreen .doa {
        color: #d8dfe2;
    }

    .Smoky .doa {
        color: #222324;
    }

</style>