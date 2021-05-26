<template>
<GridLayout :visibility="tagsList.length?'visible':'hidden'" class="result">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in tagsList" >
        <v-template>
            <GridLayout 
                columns="33,2,*" 
                class="tagLine" 
                @tap="tagPresenter( item.text )"
            >

                <Label col=0 :text="item.count" />
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

export default class SingleColumnList extends Vue {

// -- =====================================================================================

tagsList = [];

// -- =====================================================================================


// -- =====================================================================================

mounted () {}

// -- =====================================================================================


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

</style>