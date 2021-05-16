<template>
<Page>
<GridLayout class="fx" rows="40,*,40" @tap="scrollTo(+1)" @doubleTap="scrollTo(-1)">

    <Label :text="name" class="suraName" row=2 @tap="complete()" />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
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
                :myText=kalameh.text
                :fullText=kalameh.fullText || null
                :myType=kalameh.type
                @myTap=true
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
import Kalameh                          from "@/components/m/Kalameh.vue"
import store                            from "@/store/store"
import * as tools                       from "@/mixins/tools"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Ghertas extends Vue {

// -- =====================================================================================

@Prop() me: number;

// -- =====================================================================================

vahy: TS.vahy = [];
name: string = "";
taghdir_point: number;

// -- =====================================================================================

mounted () {
    store.state.here = "Ghertas";
    this.init( this.me );
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( me?: number ): void {

    let saat = new Date();
    this.taghdir_point = me === -1 ? saat.getTime() % Quran.length : me;

    // .. get the name
    const sura = Quran[ this.taghdir_point ].sura;

    // .. save trace
    storage.saveTrace_Quran( this.taghdir_point, !!me || saat.toString() );

    // .. title of sura
    this.name = asma[ sura -1 ][1] + "  ( " + sura + " ) ";

    let message = this.rouh( this.taghdir_point, sura );

    // .. delivering ...
    this.morsal( message );

}

// -- =====================================================================================

rouh ( ayah: number, sura: number ) {

    let vahy: TS.vahy = [];

    // .. loop until end of sura
    while ( Quran[ ayah ].sura === sura ) {

        let q = Quran[ ayah ];

        // .. all new sura except ONE has the ESM
        if ( q.ayah === 1 && q.sura !== 9 && q.sura !== 1 )
            vahy.push( { text: ";", type: "ESM" } );

        if ( q.sura === 1 && q.ayah === 1 ) vahy.push( { text: ";", type: "ESM" } );
        else {

            // .. divide ayah
            q.text.split( " " ).map( k => {
                vahy.push( { text: k, type: q.sajdeh ? "sajdeh" : "string" } );
            } );

            let fullText = q.text+"\n\n"+asma[ q.sura -1 ][1]+" ("+q.sura+") "+" : "+q.ayah;

            // .. add number
            vahy.push( { 
                text: q.ayah.toString(), 
                type: "number", 
                fullText: tools.arabicDigits( fullText )
            } );

        }

        // .. next one
        ayah++;

        // .. break
        if ( ayah >= Quran.length ) break;

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

async complete () {

    this.init( asma[ Quran[ this.taghdir_point ].sura -1 ][2] );

    // let current_sura = Quran[ this.taghdir_point ].sura;
    // let p = this.taghdir_point -1;

    // while ( current_sura === Quran[ p ].sura ) {

    //     let q = Quran[ p ];

    //     // .. divide ayah
    //     q.text.split( " " ).map( k => {
    //         this.vahy.unshift( { text: k, type: q.sajdeh ? "sajdeh" : "string" } );
    //     } );

    //     let fullText = q.text+"\n\n"+asma[ q.sura -1 ][1]+" ("+q.sura+") "+" : "+q.ayah;

    //     // .. add number
    //     this.vahy.unshift( { 
    //         text: q.ayah.toString(), 
    //         type: "number", 
    //         fullText: tools.arabicDigits( fullText )
    //     } );

    //     await new Promise( _ => setTimeout( _, 7 ) );

    //     p--;

    // }

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