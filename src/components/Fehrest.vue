<template>
<Page>
<GridLayout class="fehrest" rows="44,*,44">

<!---------------------------------------------------------------------------------------->

    <FlexboxLayout
        row=1
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
        <Label 
            ref="-1"
            text="صاحب‌الزمان"
            class="saat"
            @tap="open(-1)"
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
import { asma }                         from "@/db/Quran"
import store                            from "@/store/store"

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

    store.state.here = "Ghertas";

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

</style>