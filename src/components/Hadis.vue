<template>
<Page>
<GridLayout
    ref="fehrest"
    rows="*,auto,*"
>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=1>
        <Label :text="test" textWrap=true class="hadis" />
    </StackLayout>

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
import { collection }                   from "@/db/Hadis"
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

test ="";

// -- =====================================================================================

mounted () {

    // let h = "الإمامُ الصّادقُ عليه السلام";
    // let ok = JSON.stringify( 
    //     collection.filter( x => x.ar === x.fa && x.fa === h ) , null, "\t"
    // );

    // let some = JSON.stringify( 
    //     collection.filter( x => x.ar !== x.fa && ( x.ar === h || x.fa === h ) ), null, "\t"
    // );

    // let other = JSON.stringify( 
    //     collection.filter( x => x.ar !== h && x.fa !== h ), null, "\t"
    // );

    // storage.saveTest( "ok", "ts" , ok )
    // storage.saveTest( "some", "ts" , some )
    // storage.saveTest( "other", "ts" , other )

    let saat = new Date();
    let rand = saat.getTime() % collection.length;
    this.test = collection[ rand ].ar + "\n\n" + collection[ rand ].arabi;
    this.test += "\n\n\n";
    this.test += collection[ rand ].fa + "\n\n";
    this.test += collection[ rand ].farsi;
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

    store.state.here = "Ghertas";

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
    .hadis {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 14;
        padding: 20 30;
        margin: 0 .5;
        border-radius: 5;
        border-color: white;
        /* border-width: 1; */
        width: 80%;
    }

</style>