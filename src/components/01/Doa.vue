<template>
<Page>
<GridLayout class="myPage" rows="44,44,*,44,5" >

<!---------------------------------------------------------------------------------------->

     <ScrollView 
        row=2
        class="ghertas"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="true"
    >

        <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="flex-start"
        >
            <Kalameh 
                v-for="(kalameh,i) in doa"
                :key=i 
                :myText=kalameh
                myType="string"
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
import Ghertas                          from "@/components/00/Ghertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import { adeiyeh }                      from "@/db/Adeiyeh"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Doa extends Vue {

// -- =====================================================================================

@Prop() doaID: number;

// -- =====================================================================================

doa: string[] = [];

// -- =====================================================================================

mounted () {
    store.state.here = "Doa";
    this.morsal();
}

// -- =====================================================================================

async morsal () {

    let doa = adeiyeh[ this.doaID ].content;
    doa = doa.replace( /\n\n/g, " !BIG_BREAKLINE! " );
    doa = doa.replace( /\n/g, " !BREAKLINE! " );

    // .. preview
    let kalamat = doa.split( " " );

    // for( let x of kalamat.filter( (x, i) => i < 50 ) ) console.log(x);

    this.doa = kalamat.filter( (x, i) => i < 100 );

    await new Promise( _ => setTimeout( _, 700 ) );

    for ( let x=100; x < kalamat.length; x++ ) {

        this.doa.push( kalamat[ x ] );

        // .. prevent freezing
        if ( !(Number(x) % 7) ) await new Promise( _ => setTimeout( _, 7 ) );

    }

}

// -- =====================================================================================

destroyed () {
    store.state.here = "Adeiyeh";
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .myPage {
        padding: 12% 25% 27% 25%;
    }

    .string {
        font-family: Amiri-Regular;
        /* text-align: left; */
        font-size: 17;
        /* line-height: 23; */
        /* padding: 14 7; */
    }

    .CoolGreen .string {
        color: #d8d8d8;
    }

    .Smoky .string {
        color: #1e1e1f;
    }

</style>