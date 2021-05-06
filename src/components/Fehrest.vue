<template>
<Page>
<GridLayout ref="fehrest" class="fehrest" rows="44,33,44,*,44" @tap="dismiss" >

<!---------------------------------------------------------------------------------------->

    <TextField row=2 ref="fakeSearch" opacity=0 />
    <TextField 
        ref="search" 
        row=2
        hint="بحث" 
        class="search" 
        @textChange="search" 
    />

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        rowSpan=3
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

<!---------------------------------------------------------------------------------------->

        <FlexboxLayout
            ref="fehrest"
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-around"
            alignItems="center"
        >
            <Label
                v-for="(x,i) in asma"
                :key=i
                :ref="i"
                :text=x[1]
                class="sura"
                @tap="open(x[0])"
            />
            <Label
                ref="-1"
                text="صاحب‌الزمان"
                class="saat"
                @tap="open(0)"
            />
        </FlexboxLayout>

<!---------------------------------------------------------------------------------------->

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <ListView v-if=listOfItems.length row=2 for="item in listOfItems">
        <v-template>
            <Label :text="item" color="white" />
        </v-template>
    </ListView>

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
import { asma, Quran }                  from "@/db/Quran"
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

asma = asma;
listOfItems = []
// -- =====================================================================================

mounted () {}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Ghertas, {

        frame : "base",

        backstackVisible : true,

        props : {
            me : num,
        } , 

        transition : {
            name         : "slideTop",
            duration     : 300,
        } 

    } );

    store.state.here = "Ghertas";

}

// -- =====================================================================================

search ( event ) {

    let text = event.object.text;
    // .. input must be unified!
    text = text.replace( /ی/g, 'ي' );
    text = text.replace( /ک/g, 'ك' );

    // .. reset asma
    this.asma = asma;
    this.listOfItems = [];
    
    // .. filter asma + unifying asma
    this.asma = this.asma.filter( x => tools.asmaUnifier( x[1] ).includes( text ) );

    // .. search in ayat
    if ( text.length > 1 ) {
        Quran.forEach( q => {
            if ( tools.asmaUnifier( q.simple ).includes( text ) ) {
                this.listOfItems.push( q.simple );
            }
        } );
    }

}

// -- =====================================================================================

dismiss () {
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
    .fehrest {
        padding: 0 40%;
    }

    .sura, .saat {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 14;
        padding: 0 3;
        margin: 0 .5;
        border-radius: 5;
        border-color: transparent;
        border-width: 0 1;
    }

    .saat {
        background-color: #07301d;
    }

    .search {
        color: white;
        placeholder-color: #0e2335;
        border-bottom-width: 1;
        border-color: #0e2335; 
        color: #a8a8a8;
    }

</style>