<template>
<Page>
<GridLayout class="fx" rows="40,*,40">

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        class="ghertas"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

        <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="center"
        >
            <Label :text=hadis.c textWrap=true class="name" />
            <Label :text=hadis.e textWrap=true class="name_e" />
            <Kalameh 
                v-for="(kalameh, i) in hadis.a"
                :key=i 
                :myText=kalameh
                :fullText=kalameh
                myType="hadis"
                @myTap=true
            />
            <Label :text=hadis.b textWrap=true class="farsi" />
        </FlexboxLayout>

    </ScrollView>

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

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Ghertas }
} )

// -- =====================================================================================

export default class Fehrest extends Vue {

// -- =====================================================================================

hadis: { a: string[], b:string, c: string, e: string } = { 
    a: null, 
    b: null, 
    c: null, 
    e: null 
};

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
    // .. assign the Name
    this.hadis.c = c_map[ collection[ rand ].c ][0];
    this.hadis.e = c_map[ collection[ rand ].c ][1];
    // .. assign arabic part
    this.hadis.a = collection[ rand ].a.trim().split( ' ' );
    // .. assign farsi part
    this.hadis.b = collection[ rand ].b;
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

    // // let text = event.object.text;
    // let text = ( this.$refs.search as any ).nativeView.text;
    // // .. input must be unified!
    // text = text.replace( /ی/g, 'ي' );
    // text = text.replace( /ک/g, 'ك' );

    // // .. reset asma
    // this.asma = asma;
    // this.found = [];

    // // .. filter asma + unifying asma
    // this.asma = this.asma.filter( x => tools.asmaUnifier( x[1] ).includes( text ) );

    // // .. search in ayat
    // if ( text.length > 2 || force ) {
    //     Quran.forEach( (q, i) => {
    //         if ( tools.asmaUnifier( q.simple ).includes( text ) ) {
    //             this.found.push( { text: q.simple, idx: i } );
    //         }
    //     } );
    // }

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
    .ghertas {
        width: 72%;
        height: 63%;
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

</style>