<template>
<Page>
<GridLayout class="myPage" rows="44,44,*,44,5" >

<!---------------------------------------------------------------------------------------->

     <ScrollView 
        row=2
        class="ghertas"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

        <!-- <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-between"
        >
            <Kalameh 
                v-for="(kalameh,i) in doa"
                :key=i 
                :myText=kalameh
                :fullText=kalameh || null
                myType="hadis"
                @myTap=true
            />
            <Label
                v-for="i in [1,2,3,4,5,6,7,1,2,3,4,5,6,7]"
                :key=i
                alignSelf="stretch"
                height=0
                text="   "
            />
        </FlexboxLayout> -->

        <Label row=2 :text="doa" class="doa" textWrap=true />

    </ScrollView>


<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import Ghertas                          from "@/components/Ghertas.vue"
import Kalameh                          from "@/components/Kalameh.vue"
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

// doa: string[] = [];
doa: string = "";

// -- =====================================================================================

mounted () {
    store.state.here = "Doa";
    // this.doa = adeiyeh[ this.doaID ].content.split( " " );
    this.doa = adeiyeh[ this.doaID ].content;
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
        padding: 5% 25% 20% 25%;
    }

    .doa {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: left;
        font-size: 17;
        line-height: 23;
        padding: 14 7;
    }

</style>