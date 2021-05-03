<template>
<Page>
<GridLayout class="fx" rows="40,*,40">

    <Label :text="name" class="esm" row=2 />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        ref="ghertas"
        class="ghertas"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

        <FlexboxLayout 
            ref="page"
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-between"
        >
            <Kalameh 
                v-for="kalameh in vahy"
                :key=kalameh.refId 
                :ref="kalameh.refId"
                :myText=kalameh.text
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
import { asma, quran }                  from "@/db/quran"
import Kalameh                          from "@/components/Kalameh.vue"
import * as storage                     from "@/mixins/storage"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Ghertas extends Vue {

// -- =====================================================================================

@Prop() me: number;

// -- =====================================================================================

vahy: { text: string, type: "ESM"|"string"|"number" }[] = [];
name: string = "";

// -- =====================================================================================

mounted () {
    this.init( this.me )
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( me?: number ): void {

    let message: string[];
    let saat = new Date();
    let taghdir = me ? 
        quran.findIndex( x => x.sura === me ) : saat.getTime() % quran.length;

    const sura = quran[ taghdir ].sura;

    // .. save trace
    // ! storage.saveTrace( taghdir, saat.toString() );

    // .. title of sura
    this.name = asma[ sura -1 ] + "  ( " + sura + " ) ";

    // .. monzal
    let kalam = this.rouh( taghdir, sura );

    // .. trim & divide the string!
    message = kalam.trim().split( " " );

    // .. preview
    this.morsal( message.filter( (x, i) => i < 110 ), false );

    // .. full message
    this.morsal_TO = setTimeout( () => this.morsal( message ), 3000 );

}

// -- =====================================================================================

rouh ( ayah: number, sura: number ) {

    let kalam = "";

    // .. loop until end of sura
    while ( quran[ ayah ].sura === sura ) {

        let klm = quran[ ayah ];

        // .. all new sura except ONE has the ESM
        if ( klm.ayah === 1 && klm.sura !== 9 && klm.sura !== 1 ) kalam += "ESM ";

        kalam += klm.text + " " + klm.ayah + " ";

        // .. next one
        ayah++;

    }

    return kalam;

}

// -- =====================================================================================

morsal ( message: string[], bar=true ) {

    this.vahy = message.map( p => {
        let type: "string" | "number" = isNaN( Number(p) ) ? "string" : "number";
        return { text: p, type: type }
    } );

    // .. Esm Allah
    this.allah();

    // .. (de)activate scrollBarIndicatorVisible
    ( this.$refs.ghertas as any ).nativeView.scrollBarIndicatorVisible = bar;

}

// -- =====================================================================================

allah () {
    if ( this.vahy[0].text === "ESM" ) this.vahy[0] = { text: ";", type: "ESM" };
}

// -- =====================================================================================

destroyed () {
    clearTimeout( this.morsal_TO );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .ghertas {
        width: 72%;
        height: 63%;
    }

    .esm {
        color: #888888;
        font-family: MADDINA;
        width: 100%;
        text-align: center;
    }

</style>