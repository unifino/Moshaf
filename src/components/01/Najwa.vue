<template>
<Page @navigatedTo="$store.state.here='Najwa'">
<GridLayout class="myPage" rows="44,44,*,44,5">

<!---------------------------------------------------------------------------------------->

     <ScrollView 
        row=2
        verticalAlignment="middle"
        scrollBarIndicatorVisible="true"
    >

        <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="flex-start"
        >
            <Kalameh 
                v-for="(kalameh,i) in najwa"
                :key=i 
                :myText=kalameh
                myType="najwa"
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
import Qertas                           from "@/components/00/Qertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import { Najawa }                       from "@/db/N/Al-Najawa"
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

export default class Najwa extends Vue {

// -- =====================================================================================

@Prop() najwaID: number;

// -- =====================================================================================

najwa: string[] = [];

// -- =====================================================================================

mounted () {
    this.morsal();
}

// -- =====================================================================================

async morsal () {

    let najwa = Najawa[ this.najwaID ].content;
    najwa = najwa.replace( /\n\n/g, " !BIG_BREAKLINE! " );
    najwa = najwa.replace( /\n/g, " !BREAKLINE! " );

    // .. preview
    let kalamat = najwa.split( " " );
    this.najwa = kalamat.filter( (x, i) => i < 100 );
    // .. wait a bit
    await new Promise( _ => setTimeout( _, 700 ) );

    for ( let x=100; x < kalamat.length; x++ ) {

        this.najwa.push( kalamat[ x ] );

        // .. prevent freezing
        if ( !(Number(x) % 7) ) await new Promise( _ => setTimeout( _, 7 ) );

    }

}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .myPage {
        padding: 12% 25% 27% 25%;
    }

    .najwa {
        font-family: Amiri-Regular;
        font-size: 16.5;
        text-align: center;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
        height: 63;
    }

    .CoolGreen .najwa {
        color: #d8d8d8;
    }

    .Smoky .najwa {
        color: #1e1e1f;
    }

</style>