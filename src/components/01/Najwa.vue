<template>
<Page @navigatedTo="pageLoaded()">
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
import { Najawa }                       from "@/db/N/Al-Najawa"
import * as TM                          from "@/themes/themeManager"
import store                            from "@/store/store"
import Kalameh                          from "@/components/X/Kalameh.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh }
} )

// -- =====================================================================================

export default class Najwa extends Vue {

// -- =====================================================================================

@Prop() id: number;

// -- =====================================================================================

najwa: string[] = [];

// -- =====================================================================================

mounted () {
    this.morsal();
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Najwa";
    TM.themePatcher( this );
}

// -- =====================================================================================

async morsal () {

    let najwa = Najawa[ this.id ].content;
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
        padding: 12% 20% 27% 20%;
    }

    .najwa {
        font-family: Amiri-Regular;
        font-size: 15.5;
        text-align: center;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
        height: 63;
    }

    .CoolGreen  .najwa { color: #d8d8d8 }
    .Smoky      .najwa { color: #1e1e1f }
    .Black      .najwa { color: #747474 }

</style>