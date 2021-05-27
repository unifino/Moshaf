<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ScrollView verticalAlignment="middle" marginTop="20">

        <FlexboxLayout
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Label
                v-for="item in $store.state.foundData"
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

export default class Output_M3 extends Vue {

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M3" ? 
        'visible' : 'hidden';
}

// -- =====================================================================================

tagClasser ( item: TS.FoundContent ) {
    let tagClass = 'tag';
    if ( item.flags.isBounded ) tagClass += ' bounded';
    if ( item.flags.isCached ) tagClass += ' cached';
    return tagClass
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .tag {
        font-family: Amiri-Regular;
        font-family: 12;
        padding: 10;
    }

    .CoolGreen .tag {
        color: #e0e0e0;
    }

</style>