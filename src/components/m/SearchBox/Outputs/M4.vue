<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView>

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <GridLayout 
                v-for="(item,i) in $store.state.foundData"
                :key="i"
                rows="*,auto" 
                @tap="$emit( 'interact', item )"
                :class="itemClasser(item)"
            >

                <Label row=0 :text="item.text" textWrap=true class="ayah" />
                <Label row=1 :text="item.flags.address" :class="isAddressed(item)" />

            </GridLayout>

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

@Prop() vividBG: boolean;

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M4" ? 
        'visible' : 'hidden';
}

get outputBoxClass () {
    return this.vividBG ? 'outputBox transparent' : 'outputBox';
}

// -- =====================================================================================

itemClasser ( item: TS.FoundContent ) {
    let itemClass = "baseClass";
    if ( item.flags.isCached ) itemClass += " cached";
    if ( item.flags.isHeader ) itemClass += " header";
    return itemClass;
}

isAddressed ( item: TS.FoundContent) {
    return item.flags.address ? 'address' : 'hidden';
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
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
        background-color: #222324;
        color: #8b8b8b;
    }

    .CoolGreen .cached .ayah,
    .Smoky .cached .ayah{
        text-decoration: line-through;
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
        padding: 20 24;
    }

    .address {
        color: #037269;
        visibility: visible;
        font-size: 8;
        opacity: .8;
        padding: 10 0 0 0;
    }

    .hidden {
        visibility: collapse;
    }

</style>