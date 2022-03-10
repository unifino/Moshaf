<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="fx" rows="40,*,auto,*,40">

<!---------------------------------------------------------------------------------------->

    <ScrollView
        row=2
        ref="qertas"
        class="qertas"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="true"
    >

        <FlexboxLayout
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-between"
        >
            <Kalameh
                v-for="(kalameh,i) in vahy"
                :ref="'kalameh_' + kalameh.aID"
                :key="kalameh.aID + '_' + i"
                :aID=kalameh.aID
                :myText=kalameh.text
                :myType=kalameh.type
                @tap=kalamehTapped
                @longPress=kalamehLongPressed
            />
            <Label
                v-for="i in [1,2,3,4,5,6,7]"
                :key=i
                alignSelf="stretch"
                height=0
                text="   "
            />
        </FlexboxLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <Label row=3 @tap="scrollTo(+1)" @doubleTap="scrollTo(-1)" />

    <IntuitivePanel ref="IntuitivePanel" rowSpan=5 />

<!---------------------------------------------------------------------------------------->

    <Label :text="name" class="suraName" row=4 @tap="complete()" />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TM                          from "@/themes/themeManager"
import * as TS                          from "@/../types/myTypes"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { asma, Quran }                  from "@/db/Q/Quran"

import Kalameh                          from "@/components/X/Kalameh.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, IntuitivePanel }
} )

// -- =====================================================================================

export default class Qertas extends Vue {

// -- =====================================================================================

@Prop() id: number;

// -- =====================================================================================

vahy: TS.vahy = [];
name: string = "";
taghdir_aID: number;

// -- =====================================================================================

mounted () {
    this.init( this.id );
    ( this.$refs.IntuitivePanel as any ).$refs.searchPanel.activeMode = "Q";
    ( this.$refs.IntuitivePanel as any ).$refs.searchPanel.defaultActiveMode = "Q";
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = 'Qertas';
    TM.themePatcher( this );
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( id?: number ): void {

    let message: TS.vahy,
        ayat: number[] = [],
        aID: number;

    // .. Special-Favorite List
    if ( id === -3 ) ayat = [
        0,261,
        6225,6226,6227,6228,6229,
        6230,6231,6232,6233,6234,6235,
        3788,3789,3790,3791,3792,3793,3794,3795,3796,3797,
        3960,3961,3962,3963,3964,3965,3966,3967,3968,3969
    ];
    // .. Special-Favorite List
    else if ( id === -2 ) ayat = [ 0,261,0,3425,3426,3427,0,3967,3968,3969 ];

    // .. Random & Simple Mode
    else {

        // .. Taghdir | Direct
        this.taghdir_aID = !~id ? tools.saheb( "Q" ) : id;
        // .. make a copy
        aID = this.taghdir_aID;
        // .. get the name
        const sura = Quran[ this.taghdir_aID ].sura;
        // .. title of sura
        this.name = asma[ sura -1 ][1] + "  ( " + sura + " ) ";

        // .. get list
        while ( Quran[ aID ].sura === sura ) {
            ayat.push( aID ); aID++; if ( aID >= Quran.length ) break;
        }

        tools.setHistory( "Q", this.taghdir_aID );

    }

    // .. get message
    message = this.rouh( ayat );

    // .. delivering ...
    this.morsalStatus = "running";
    this.morsal( message );

}

// -- =====================================================================================

rouh ( ayat: number[] ) {

    let vahy: TS.vahy = [];

    // .. loop until end of sura
    for ( let aID of ayat ) {

        let q = Quran[ aID ];

        // .. all new sura except ONE has the ESM
        if ( q.ayah === 1 && q.sura !== 9 && q.sura !== 1 )
            vahy.push( { aID: aID, text: ";", type: "ESM" } );

        // .. handling ...
        if ( q.sura === 1 && q.ayah === 1 )
            vahy.push( { aID: aID, text: ";", type: "ESM" } );

        else {

            // .. divide ayah
            q.text.split( " " ).map( k => {
                vahy.push( { aID: aID, text: k, type: q.sajdeh ? "sajdeh" : "quran" } );
            } );

            // .. add number
            vahy.push( { aID: aID, text: q.ayah.toString(), type: "number" } );

        }

    }

    return vahy;

}

// -- =====================================================================================

morsalStatus: "silent"|"running"|"breaking" = "silent";
async morsal ( message: TS.vahy ) {

    // .. preview
    this.vahy = message.filter( (x, i) => i < 100 );

    await new Promise( _ => setTimeout( _, 700 ) );

    for ( let x=100; x < message.length && this.morsalStatus !== "breaking"; x++ ) {

        this.vahy.push( message[ x ] );

        // .. prevent freezing
        if ( !(Number(x) % 7) ) await new Promise( _ => setTimeout( _, 7 ) );

    }

    this.morsalStatus = "silent";

}

// -- =====================================================================================

kalamehTapped ( text: string, type: TS.Kalameh, aID: number ) {
    if ( type === "number" ) 
        ( this.$refs.IntuitivePanel as IntuitivePanel ).init( "Q", aID );
}

// -- =====================================================================================

kalamehLongPressed ( text: string, type: TS.Kalameh, aID: number ) {

    if ( type === "number" ) {
        tools.setHistory( "Q", aID );
        tools.toaster( "Added to Clipboard: History" )
    }

}

// -- =====================================================================================

async complete () {

    switch ( this.morsalStatus ) {

        case "breaking":
            await new Promise( _ => setTimeout( _, 7 ) );
            this.complete(); 
        break;

        case "running":
            this.morsalStatus = "breaking"; 
            await new Promise( _ => setTimeout( _, 7 ) );
            this.complete(); 
        break;

        case "silent": 
            this.init( asma[ Quran[ this.taghdir_aID ].sura -1 ][2] ); 
        break;

    }

}

// -- =====================================================================================

scrollStep = 0;
scrollTo ( step: 1|-1 ) {

    let h = 63;
    let k_s = Object.keys( this.$refs ).filter( x => x.includes( "kalameh" ) );
    for ( let k of k_s as string[] ) {
        let h0 = ( this.$refs[ k ][0] as any ).nativeView.getActualSize().height;
        if ( h0 < 100 && h0 > 30 ) {
            h = h0;
            break;
        }
    }

    this.scrollStep += step;
    if ( this.scrollStep < 0 ) this.scrollStep = 0;

    let qertas = ( this.$refs as any ).qertas.nativeView;
    qertas.height = h *8;
    qertas.scrollToVerticalOffset( h *8 *this.scrollStep, true );

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .qertas {
        width: 300;
        height: 504;
    }

    .suraName {
        font-family: MADDINA;
        font-size: 15;
        width: 100%;
        text-align: center;
    }

    .CoolGreen  .suraName { color: #bebebe }
    .Smoky      .suraName { color: #7c7c7c }
    .Black      .suraName { color: #444444 }

    .ESM {
        font-size: 140;
        width: 100%;
        font-family: Besmellah_2;
        padding: 8 2;
        margin-top: -62.9;
        height: 125.8;
        text-align: center;
    }

    .CoolGreen  .ESM { color: #548505 }
    .Smoky      .ESM { color: #548505 }
    .Black      .ESM { color: #548505 }

    .quran, .sajdeh {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
        height: 63;
    }

    .CoolGreen  .quran { color: #e6e6e6 }
    .Smoky      .quran { color: #696868 }
    .Black      .quran { color: #9e9e9e }

    .CoolGreen  .sajdeh { color: #2b99e2 }
    .Smoky      .sajdeh { color: #1a6fa8 }
    .Black      .sajdeh { color: #1a6fa8 }

    .number {
        font-family: MADDINA;
        text-align: center;
        font-size: 16;
        padding-top: 1.2;
        margin: 22.5 3.3 17.5 3.7;
        width: 23;
        height: 23;
        align-self: center;
        border-radius: 99;
        font-weight: bold;
    }

    .CoolGreen .number {
        background-color: #4dbae6;
        color: #031a1d;
    }
    .Smoky .number {
        background-color: #3a9ec5;
        color: #e6e6e6;
    }
    .Black .number {
        background-color: #242424;
        color: #26596d;
    }

    .bounded {
        font-size: 13;
        border-width: 3;
        padding-top: .25;

    }

    .CoolGreen .bounded {
        background-color: #f0b12a;
        border-color: #e48407;
        color: #64645b;
    }
    .Smoky .bounded {
        background-color: #f0b12a;
        border-color: #e48407;
        color: #64645b;
    }
    .Black .bounded {
        background-color: #f0b12a;
        border-color: #e48407;
        color: #64645b;
    }

/* ------------------------------------------- */
    .CoolGreen .fav {
        background-color: #da0f74;
        color: #e6e6e6;
    }
    .Smoky .fav {
        background-color: #da0f74;
        color: #e6e6e6;
    }
    .Black .fav {
        background-color: #da0f74;
        color: #e6e6e6;
    }

</style>