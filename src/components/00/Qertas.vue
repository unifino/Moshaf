<template>
<Page @navigatedTo="$store.state.here='Qertas'">
<GridLayout class="fx" rows="40,*,auto,*,40">

    <Label :text="name" class="suraName" row=4 @tap="complete()" />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=2
        ref="qertas"
        class="qertas"
        orientation="vertical"
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

    <ToolBar ref="ToolBar" rowSpan=5 />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import { asma, Quran }                  from "@/db/Q/Quran"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import Kalameh                          from "@/components/m/Kalameh.vue"
import ToolBar                          from "@/components/00/ToolBar.vue"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, ToolBar }
} )

// -- =====================================================================================

export default class Qertas extends Vue {

// -- =====================================================================================

@Prop() me: number;

// -- =====================================================================================

vahy: TS.vahy = [];
name: string = "";
taghdir_aID: number;

// -- =====================================================================================

mounted () {
    this.init( this.me );
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( me?: number ): void {

    let saat = new Date();
    this.taghdir_aID = me === -1 ? saat.getTime() % Quran.length : me;

    // .. get the name
    const sura = Quran[ this.taghdir_aID ].sura;

    // .. add trace ( unique! )
    let old = storage.trace_q.findIndex( x => x === this.taghdir_aID );
    if ( ~old ) storage.trace_q.splice( old, 1 );
    storage.trace_q.push( this.taghdir_aID );
    // .. hard registration
    storage.saveDB( storage.trace_q_File, storage.trace_q.filter( (x,i) => i<44 ) );
    // .. title of sura
    this.name = asma[ sura -1 ][1] + "  ( " + sura + " ) ";

    let message = this.rouh( this.taghdir_aID, sura );

    // .. delivering ...
    this.morsal( message );

}

// -- =====================================================================================

rouh ( aID: number, sura: number ) {

    let vahy: TS.vahy = [];

    // .. loop until end of sura
    while ( Quran[ aID ].sura === sura ) {

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

        // .. next one
        aID++;

        // .. break
        if ( aID >= Quran.length ) break;

    }

    return vahy;

}

// -- =====================================================================================

async morsal ( message: TS.vahy ) {

    // .. preview
    this.vahy = message.filter( (x, i) => i < 100 );

    await new Promise( _ => setTimeout( _, 700 ) );

    for ( let x=100; x < message.length; x++ ) {

        this.vahy.push( message[ x ] );

        // .. prevent freezing
        if ( !(Number(x) % 7) ) await new Promise( _ => setTimeout( _, 7 ) );

    }

}

// -- =====================================================================================

kalamehTapped ( text: string, type: TS.Kalameh, aID: number ) {

    if ( type === "number" ) store.state.activeAyah = aID;

}

// -- =====================================================================================

async complete () {

    this.init( asma[ Quran[ this.taghdir_aID ].sura -1 ][2] );

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

exit () {
    clearTimeout( this.morsal_TO );
    ( this as any ).$navigateBack();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
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

    .CoolGreen .suraName {
        color: #bebebe;
    }

    .Smoky .suraName {
        color: #7c7c7c;
    }

    .ESM {
        font-size: 140;
        width: 100%;
        font-family: Besmellah_2;
        padding: 8 2;
        margin-top: -62.9;
        height: 125.8;
        text-align: center;
    }

    .CoolGreen .ESM {
        color: #548505;
    }

    .Smoky .ESM {
        color: #548505;
    }

    .quran, .sajdeh {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
        height: 63;
    }

    .CoolGreen .quran {
        color: #e6e6e6;
    }

    .CoolGreen .sajdeh {
        color: #2b99e2;
    }

    .Smoky .sajdeh {
        color: #1a6fa8;
    }

    .number {
        font-family: MADDINA;
        text-align: center;
        font-size: 16;
        padding-top: 1.4;
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

    .CoolGreen .fav {
        background-color: #a31f87;
    }

    .Smoky .fav {
        background-color: #a31f87;
    }

    .tagged {
        border-width: 3;
        padding-top: -1.1;
        border-color: #dd5c07;
    }

</style>