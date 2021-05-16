<template>
<Page>
<GridLayout class="myPage" rows="44,44,44,*,7" >

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

    <ScrollView
        row=3
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
                :myText=kalameh.text
                :fullText=kalameh.text
                :myType=kalameh.type
                @myTap=true
            />

            <Label class="divider" />

            <Label :text=hadis.b textWrap=true class="farsi" />

        </FlexboxLayout>

    </ScrollView>


<!---------------------------------------------------------------------------------------->

    <GridLayout v-if=found.length class="result" row=3 >

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

    <GridLayout rowSpan=5 rows="*,110" >
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
import Ghertas                          from "@/components/00/Ghertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
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

hadis: {
    a: {
        text: string, 
        type: "hadis"|"hadis green"
    }[],
    b:string,
    c: string,
    d: string|number,
    e: string
} = {
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

    // .. mini patch
    if ( collection[ id ].c === null ) {
        collection[ id ].c = 19;
    }

    // .. assign the Name
    this.hadis.c = c_map[ collection[ id ].c ][0];
    this.hadis.e = c_map[ collection[ id ].c ][1];
    // .. assign arabic part
    this.hadis.a = [];
    let tmpBox = collection[ id ].a.trim().split( ' ' );
    let green = false;
    for ( let tmp of tmpBox ) {

        if ( tmp.includes( "<Q>" ) || tmp.includes( "</Q>" ) ) {
            green = !green;
            tmp = tmp.replace( "<Q>", "" );
            tmp = tmp.replace( "</Q>", "" );
        }

        if ( tmp ) {
            this.hadis.a.push( 
                {
                    text: tmp,
                    type: green ? "hadis green" : "hadis"
                }
            );
        }

    }
    // .. assign farsi part
    this.hadis.b = collection[ id ].b || "";
    this.hadis.d = collection[ id ].d || "";

    // .. save trace
    storage.saveTrace_Hadis( id, !!force || new Date().toString() );

}

// -- =====================================================================================

copy () {

    let full = "";
    full += this.hadis.c;
    full += " (" + this.hadis.e + "):\n\n";
    full += this.hadis.a.reduce( (f,x) => f + " " + x.text , "" ).trim();

    if ( this.hadis.b ) {
        full += "\n\n";
        full += this.hadis.b;
    }

    if ( this.hadis.d ) {
        full += "\n\n";
        full += this.hadis.d;
    }

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
            if ( q.a ) 
                if ( tools.asmaUnifier( tools.erabTrimmer( q.a || "" ) ).includes( text ) )
                    this.found.push( { text: q.a, idx: i } );
            if ( q.b )
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
        width: 300;
    }

    .paper {
        height: 72%;
    }

    .hadis {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 15.5;
        line-height: 7;
        padding: 3;
        border-radius: 5;
    }

    .CoolGreen .hadis {
        color: #d8d8d8;
    }

    .Smoky .hadis {
        color: #1e2224;
    }

    .CoolGreen .green {
        color: #498c29;
    }

    .farsi {
        margin: 20;
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 13;
    }

    .CoolGreen .farsi {
        color: #c5c5c5;
    }

    .name, .name_e {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 18;
        margin-bottom: 30;
        height: 50;
    }

    .CoolGreen .name {
        color: #498c29;
    }

    .Smoky .name {
        color: #62922b;
    }

    .name_e {
        height: 20;
        margin-top: 14.4;
        margin-right: 3;
        font-size: 23;
        font-family: Alaem;
        color: #5b8814;
    }

    .CoolGreen .name_e {
        color: #498c29;
    }

    .Smoky .name_e {
        color: #4e791d;
    }

    .divider {
        width: 100%;
        height: 1;
    }

</style>