<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in $store.state.foundData" >
        <v-template>

            <GridLayout columns="33,2,*" class="tagLine" @tap="openTag(item)">

                <Label col=0 :text="item.flags.count" />
                <StackLayout background="gray" col=1 />
                <Label col=2 :text="item.text" />

            </GridLayout>

        </v-template>
    </ListView>


<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M2 extends Vue {

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M2" ? 
        'visible' : 'hidden';
}

// -- =====================================================================================

openTag ( tag: TS.FoundContent ) {

    // .. preparing
    store.state.foundData = [];
    store.state.foundDataSlot = "M4";

    let tmpBoundItem: TS.FoundContent,
        itemCodes = store.state.cakeBound[ "T_" + tag.text ] || [];

    // .. convert codes to the content
    for ( let item of itemCodes ) {
        tmpBoundItem = tools.boundParser( item );
        if ( tmpBoundItem ) store.state.foundData.push( tmpBoundItem );
    }

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .Smoky .tagLine {
        /* background-color: #c4c2c2; */
        color: #383838;
        font-size: 16;
        border-radius: 4;
        padding: 4 10;
        margin: 4 0;
        font-family: Amiri-Regular;
    }

</style>