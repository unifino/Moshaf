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
import { asma, Quran }                  from "@/db/Quran"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import Kalameh                          from "@/components/Kalameh.vue"
import store                            from "@/store/store"

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

// -- =====================================================================================

mounted () {
    this.init( this.me )
}

// -- =====================================================================================

morsal_TO: NodeJS.Timeout | any;
init ( me?: number ): void {

    let saat = new Date();
    let taghdir = me ? 
        Quran.findIndex( x => x.sura === me ) : saat.getTime() % Quran.length;

    // .. get the name
    const sura = Quran[ taghdir ].sura;

    // .. save trace
    storage.saveTrace( taghdir, !!me || saat.toString() );

    // .. title of sura
    this.name = asma[ sura -1 ] + "  ( " + sura + " ) ";

    let message = this.rouh( taghdir, sura );

    // .. preview
    this.morsal( message, 110 );

    // .. full message
    this.morsal_TO = setTimeout( () => this.morsal( message, 0 ), 3000 );

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

        // .. divide ayah
        q.text.split( " " ).map( k => 
            vahy.push( { text: k, type: q.sajdeh ? "sajdeh" : "string" } )
        );

        // .. add number
        vahy.push( { text: q.ayah.toString(), type: "number" } );

        // .. next one
        ayah++;

    }

    return vahy;

}

// -- =====================================================================================

morsal ( message: TS.vahy, limit: number ) {

    this.vahy = message.filter( (x, i) => i < ( limit || Infinity ) );

    // .. (de)activate scrollBarIndicatorVisible
    ( this.$refs.ghertas as any ).nativeView.scrollBarIndicatorVisible = !limit;

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