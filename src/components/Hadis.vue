<template>
<Page>
<GridLayout class="myPage" rows="44,44,44,*,7" columns="auto,*" >

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
        @longPress="popLastTrace()"
        class="fas button" 
    />

<!---------------------------------------------------------------------------------------->

    <ScrollView
        row=3
        colSpan=2
        rowSpan=3
        class="paper"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
        @swipe="swipePass=true"
    >

        <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="center"
        >

            <Label :text=hadis.c textWrap=true class="name" @tap="copy()" />
            <Label :text=hadis.e textWrap=true class="name_e" @tap="copy()" />

            <Label class="divider" />

            <Kalameh 
                v-for="(kalameh, i) in hadis.a"
                :key=i 
                :myText=kalameh
                :fullText=kalameh
                myType="hadis"
                @myTap=true
            />

            <Label class="divider" />

            <Label :text=hadis.b textWrap=true class="farsi" />

        </FlexboxLayout>

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
                    @tap="show( item.idx, true );dismiss( true )" 
                />
            </v-template>
        </ListView>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout colSpan=2 rowSpan=5 rows="*,110" >
        <GridLayout row=1 @tap="init()" />
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
import { c_map, collection }            from "@/db/Hadis"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Ghertas }
} )

// -- =====================================================================================

export default class Hadis extends Vue {

// -- =====================================================================================

hadis: { a: string[], b:string, c: string, d: string, e: string } = { 
    a: null, 
    b: null, 
    c: null, 
    d: null, 
    e: null 
};
found = [];
swipePass;

// -- =====================================================================================

mounted () {
    store.state.here = "Hadis";
    this.init();
}

// -- =====================================================================================

init () {

    // .. get a random one
    let saat = new Date();
    let rand = saat.getTime() % collection.length;

    // .. it has been read already
    while ( storage.trace_h.find( x => x.hadis === rand ) )
        rand = saat.getTime() % collection.length;

    // .. show it
    this.show( rand );

}

// -- =====================================================================================

show ( id: number, force=false ) {

    // .. assign the Name
    this.hadis.c = c_map[ collection[ id ].c ][0];
    this.hadis.e = c_map[ collection[ id ].c ][1];
    // .. assign arabic part
    this.hadis.a = collection[ id ].a.trim().split( ' ' );
    // .. assign farsi part
    this.hadis.b = collection[ id ].b;
    this.hadis.d = collection[ id ].d;

    // .. save trace
    storage.saveTrace_Hadis( id, !!force || new Date().toString() );

}

// -- =====================================================================================

copy () {

    let full = "";
    full += this.hadis.c;
    full += " (" + this.hadis.e + "):\n\n";
    full += this.hadis.a.join( " " );
    full += "\n\n";
    full += this.hadis.b;
    full += "\n\n";
    full += this.hadis.d;

    setText( full );
    tools.toaster( "حدیث کپی شد.", "short" );

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
    text = tools.erabTrimmer( text );

    // .. reset
    this.found = [];

    // .. search in ayat
    if ( text.length > 2 || force ) {
        collection.forEach( (q, i) => {
            if ( tools.asmaUnifier( tools.erabTrimmer( q.a || "" ) ).includes( text ) )
                this.found.push( { text: q.a, idx: i } );
            if ( tools.asmaUnifier( q.b ).includes( text ) )
                this.found.push( { text: q.b, idx: i } );
        } );
    }

}

// -- =====================================================================================

popLastTrace () {
    storage.saveTrace_Hadis( null, null, true );
    tools.toaster( "pop!", "short" );
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
    .myPage {
        padding: 0 48%;
    }

    .paper {
        width: 72%;
        height: 72%;
    }

    .farsi {
        margin: 20;
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 13;
    }

    .name, .name_e {
        width: 100%;
        font-family: Amiri-Regular;
        color: #5b8814;
        text-align: center;
        font-size: 18;
    }

    .name_e {
        font-size: 12;
        margin-bottom: 30;
        color: #436311;
    }

    .divider {
        width: 100%;
        height: 1;
    }

</style>