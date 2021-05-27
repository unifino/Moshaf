<template>
<GridLayout :visibility="visibility" class="result">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in $store.state.foundData" >
        <v-template>

            <GridLayout columns="33,2,*" class="tagLine" @tap="tagPresenter(item)">

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

tagPresenter ( tagName: string ) {
    console.log(tagName);
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .result {
        padding: 20 24;
        margin-bottom: 44;
        border-radius: 0 0 7 7;
    }

    .item {
        font-family: Amiri-Regular;
        font-family: 12;
        padding: 10;
    }

    .CoolGreen .result {
        background-color: #0f1616;
    }

    .Smoky .result {
        background-color: #dbdbdb;
    }

    .CoolGreen .item {
        color: #e0e0e0;
    }

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