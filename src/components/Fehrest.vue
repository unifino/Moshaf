<template>
<Page>
<GridLayout class="fehrest">

<!---------------------------------------------------------------------------------------->

    <FlexboxLayout 
        ref="fehrest"
        flexWrap="wrap"
        flexDirection="row-reverse"
        justifyContent="space-between"
    >
        <Label 
            v-for="(esm,i) in asma"
            :key=i
            :ref="i"
            :text=esm
            class="sura"
            @tap="open(i)"
        />
    </FlexboxLayout>

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
import { asma, quran }                  from "@/db/quran"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Ghertas }
} )

// -- =====================================================================================

export default class Fehrest extends Vue {

// -- =====================================================================================

asma = asma;

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Ghertas, {

        frame : this.$parent.$parent.$refs.base ,

        backstackVisible : true ,

        props : {
            me : num +1,
        } , 

        transition : {
            name         : "slideTop" ,
            duration     : 300 ,
        } 

    } );

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
        height: 72%;
        width: 80%;
        margin: 14% 10%;
    }

    .sura {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 14;
        padding: 1 3;
        margin: 1 .5;
        border-radius: 5;
        border-color: #23ffffff;
        border-width: 1;
    }

</style>