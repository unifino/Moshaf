<template>
<Page>
<GridLayout class="fx" rows="40,*,auto,*,40">

    <Label :text="name" class="suraName" row=4 @tap="complete()" />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=2
        ref="ghertas"
        class="ghertas"
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
                ref="Kalameh"
                :key=i 
                :aID=kalameh.aID
                :myText=kalameh.text
                :myType=kalameh.type
                @tap=kalamehTapped
            />
            <Label
                v-for="i in [1,2,3,4,5,6,7,1,2,3,4,5,6,7]"
                :key=i
                alignSelf="stretch"
                height=0
                text="   "
            />
        </FlexboxLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <Label row=3 @tap="scrollTo(+1)" @doubleTap="scrollTo(-1)" />

    <Menu rowSpan=5 />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import { asma, Quran }                  from "@/db/Quran"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import Kalameh                          from "@/components/m/Kalameh.vue"
import Menu                             from "@/components/00/ToolBar.vue"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Menu }
} )

// -- =====================================================================================

export default class Ghertas extends Vue {

// -- =====================================================================================

@Prop() me: number;

// -- =====================================================================================

vahy: TS.vahy = [];
name: string = "";
taghdir_aID: number;

// -- =====================================================================================

mounted () {
    store.state.here = "Ghertas";
    this.init( this.me );
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( me?: number ): void {

    let saat = new Date();
    this.taghdir_aID = me === -1 ? saat.getTime() % Quran.length : me;

    // .. get the name
    const sura = Quran[ this.taghdir_aID ].sura;

    // .. save trace
    storage.saveTrace_Quran( this.taghdir_aID, !!me || saat.toString() );

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

    for ( let k of this.$refs.Kalameh as any[] ) {
        let h0 = k.nativeView.getActualSize().height;
        if ( h0 < 100 && h0 > 30 ) {
            h = h0;
            break;
        }
    }

    this.scrollStep += step;
    if ( this.scrollStep < 0 ) this.scrollStep = 0;

    let ghertas = ( this.$refs as any ).ghertas.nativeView;
    ghertas.height = h *8;
    ghertas.scrollToVerticalOffset( h *8 *this.scrollStep, true );

}

// -- =====================================================================================

destroyed () {
    clearTimeout( this.morsal_TO );
    store.state.here = "Fehrest";
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .ghertas {
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

</style>