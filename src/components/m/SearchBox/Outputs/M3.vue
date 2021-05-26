<template>
<GridLayout :visibility="result_tag.length?'visible':'hidden'" class="result">

<!---------------------------------------------------------------------------------------->

    <ScrollView verticalAlignment="middle" marginTop="20">

        <FlexboxLayout
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Label
                v-for="item in result_tag"
                :key="item.idx"
                :class="tagClasser(item)"
                :text="item.text"
                textWrap=true
                @tap="toggleTag(item.text)" 
            />

        </FlexboxLayout>

    </ScrollView>

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

result_tag = [];

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