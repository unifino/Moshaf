<template>
<GridLayout>

<!---------------------------------------------------------------------------------------->

    <ScrollView
        class="paper"
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
                :myType=kalameh.type
            />

            <Label class="divider" />

            <Label :text=hadis.b textWrap=true class="farsi" />

        </FlexboxLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <GridLayout rowSpan=5 rows="*,230" >
        <GridLayout row=1 @tap="init()" @doubleTap="toggleFavorite()" />
    </GridLayout>

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
import { Hadith }                       from "@/db/H/Al-Hadith"
import { c_map }                        from "@/db/H/info"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"
import Kalameh                          from "@/components/m/Kalameh.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Day extends Vue {

// -- =====================================================================================

hadis: {
    a: { text: string, type: "hadis"|"hadis green" }[],
    b: string,
    c: string,
    d: string|number,
    e: string
} = { 
    a: null, b: null, c: null, d: null, e: null 
};
currentId: number;

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

init ( id: number = -1 ) {

    this.currentId = id;

    if ( ~id ) this.show( id );

    else {

        // .. get a random one
        let saat = new Date();
        let rand = saat.getTime() % Hadith.length;

        // .. it has been read already
        while ( store.state.memo.H.includes( rand ) ) rand = saat.getTime() % Hadith.length;

        // .. register the ID
        this.currentId = rand;

        // .. show it
        this.show( rand );

    }

}

// -- =====================================================================================

show ( id: number ) {

    // .. mini patch
    if ( Hadith[ id ].c === null ) {
        Hadith[ id ].c = 19;
    }

    // .. assign the Name
    this.hadis.c = c_map[ Hadith[ id ].c ][0];
    this.hadis.e = c_map[ Hadith[ id ].c ][1];
    // .. assign arabic part
    this.hadis.a = [];
    let tmpBox = Hadith[ id ].a.trim().split( ' ' );
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
    this.hadis.b = Hadith[ id ].b || "";
    this.hadis.d = Hadith[ id ].d || "";

    // .. add new trace
    let old = store.state.memo.H.findIndex( x => x === id );
    if ( ~old ) store.state.memo.H.splice( old, 1 );
    store.state.memo.H.push( id );
    // .. hard registration
    storage.saveDB( storage.trace_h_File, store.state.memo.H, 44 );

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

toggleFavorite () {
    let trace = store.state.fav.H.indexOf( this.currentId );
    // .. add to Favorite
    if ( !~trace ) store.state.fav.H.push( this.currentId );
    // .. pop out of Favorite
    else store.state.fav.H.splice( trace, 1 );
    // .. Toast it
    tools.toaster( !~trace ? "💚" : "💔" );
    storage.saveDB( storage.fav_h_File, store.state.fav.H );
}

// -- =====================================================================================

popLastTrace () {
    // .. remove last trace
    store.state.memo.H.pop();
    // .. hard registration
    storage.saveDB( storage.trace_h_File, store.state.memo.H );
    // .. notify the action
    tools.toaster( "pop!", "short" );
}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
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

    .Smoky .green {
        color: #3e9217;
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

    .salam {
        font-family: Alaem;
        padding-top: 20;
    }

    .CoolGreen .salam {
        color: #4dbae6;
    }

    .Smoky .salam {
        color: #1d80a7;
    }

</style>