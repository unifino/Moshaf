<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView >

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <Label 
                v-for="(item,i) in $store.state.foundData"
                :class="boundedClasser(item)"
                :key="i"
                :text="item.text"
                textWrap="true"
                @tap="$emit( 'interact', item )" 
            />

        </StackLayout>

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

export default class Output_M4 extends Vue {

// -- =====================================================================================

@Prop() transparentBG: boolean;

// -- =====================================================================================

boundedItems: TS.FoundContent[] = [];
cachedBounded: string[];
cachedLastID: number;

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M4" ? 
        'visible' : 'hidden';
}

get outputBoxClass () {
    return this.transparentBG ? 'outputBox transparent' : 'outputBox';
}

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

boundedClasser ( item: TS.FoundContent ) {
    let boundClass = "boundedItem";
    if ( item.flags.isCached ) boundClass += " cached";
    if ( item.flags.isHeader ) boundClass += " header";
    if ( item.flags.isBounded ) boundClass += " bounded";
    return boundClass
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .boundedItem {
        margin: 5 0;
        padding: 12 16;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .CoolGreen .boundedItem {
        background-color: #171718;
        color: #8b8b8b;
    }
    
    .Smoky .boundedItem {
        background-color: #d8d8d8;
        color: #0c85aa;
    }

    .CoolGreen .cached,
    .Smoky .cached {
        text-decoration: line-through;
        background-color: #222324;
        color: #8b8b8b;
    }

    .CoolGreen .header,
    .Smoky .header {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .transparent {
        background-color: transparent;
    }

</style>