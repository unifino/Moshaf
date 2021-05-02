<template>
<GridLayout class="fx" rows="40,*,40">

    <Label :text="sura" class="esm" row=2 />

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
        </FlexboxLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import { asma, quran }                  from "@/db/quran"
import Kalameh                          from "@/components/Kalameh.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Ghertas extends Vue {

// -- =====================================================================================

vahy: { refId: number, text: string, type: "number"|"string" }[] = [];
sura: string = "";

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

init (): void {

    let kalam = "";
    let folk: string[];
    let saheb = new Date();
    let taghdir = saheb.getTime() % quran.length;
    const sura = quran[ taghdir ].sura;

    // .. loop until end of sura
    while ( quran[ taghdir ].sura === sura ) {

        let kalameh = quran[ taghdir ];
        // .. all new sura except ONE has this...
        if ( kalameh.ayah === 1 && kalameh.sura !== 9 ) {
            if ( quran[ taghdir ].sura !== 1 ) kalam += "\n\n";
            kalam += quran[0].text + "\n";
        }
        else kalam += kalameh.text + " " + kalameh.ayah + " ";

        // .. next one
        taghdir++;

        // ! check end of the Book!

    }

    // .. title
    this.sura = asma[ sura -1 ] + "  ( " + sura + " ) ";

    // .. divide the string!
    folk = kalam.split( " " );

    // .. create the actual data with some limitation
    this.vahy = folk.map( p => {
        let type: "string" | "number" = isNaN( Number(p) ) ? "string" : "number";
        return { refId: 0, text: p, type: type }
    } ).filter( (x, i) => x.text && i < 110 );

    // .. re-create the actual data with-out some limitation
    setTimeout( () => { 
        this.vahy = folk.map( p => {
            let type: "string" | "number" = isNaN( Number(p) ) ? "string" : "number";
            return { refId: 0, text: p, type: type }
        } ).filter( (x, i) => x.text );

        // .. activate scrollBarIndicatorVisible
        ( this.$refs.ghertas as any ).nativeView.scrollBarIndicatorVisible = true;
    }, 3000 )

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