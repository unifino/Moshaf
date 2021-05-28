<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView >

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <Label 
                v-for="(item,i) in $store.state.foundData"
                :class="itemClasser(item)"
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
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M4 extends Vue {

// -- =====================================================================================

@Prop() transparentBG: boolean;

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M4" ? 
        'visible' : 'hidden';
}

get outputBoxClass () {
    return this.transparentBG ? 'outputBox transparent' : 'outputBox';
}

// -- =====================================================================================

itemClasser ( item: TS.FoundContent ) {
    let itemClass = "baseClass";
    if ( item.flags.isCached ) itemClass += " cached";
    if ( item.flags.isHeader ) itemClass += " header";
    return itemClass;
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .baseClass {
        width: 100%;
        margin: 5 0;
        padding: 12 16;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .baseClass {
        margin: 5 0;
        padding: 12 16;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .CoolGreen .baseClass {
        background-color: #171718;
        color: #8b8b8b;
    }
    
    .Smoky .baseClass {
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