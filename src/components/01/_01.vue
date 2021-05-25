<template>
<Page @navigatedTo="$store.state.here='Base_01'">
<GridLayout class="myPage" rows="44,44,44,44,*,72" >

<!---------------------------------------------------------------------------------------->

    <ListView row=4 for="(doa, idx) in adeiyeh" >
        <v-template>
            <Label
                :text="doa.title"
                textWrap=true
                class="doa"
                @tap="open( idx )" 
            />
        </v-template>
    </ListView>
<!---------------------------------------------------------------------------------------->

    <SearchBox
        ref="search"
        row=2
        rowSpan=2
        @interact="open"
        source="H"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Doa                              from "@/components/01/Doa.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import { adeiyeh }                      from "@/db/D/Adeiyeh"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox.vue"

// -- =====================================================================================

@Component ( {
    components: { Doa, SearchBox }
} )

// -- =====================================================================================

export default class Base_01 extends Vue {

// -- =====================================================================================

adeiyeh: { title: string, content: string }[] = [];
found = [];

// -- =====================================================================================

mounted () {
    this.adeiyeh = adeiyeh;
}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Doa, {

        frame : "_base_" ,
        props : { doaID : num },
        backstackVisible : true,
        transition : { name: "slideTop", duration: 300 }

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
    .myPage {
        width: 300;
    }

    .doa {
        margin: 20;
        font-family: JF Flat;
        text-align: center;
        font-size: 16;
    }

    .CoolGreen .doa {
        color: #d8dfe2;
    }

    .Smoky .doa {
        color: #222324;
    }

</style>