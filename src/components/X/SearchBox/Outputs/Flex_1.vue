<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView>

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <GridLayout 
                v-for="(item,i) in $store.state.foundData"
                :key="i"
                rows="*,auto" 
                @tap="$emit( 'interact', item );itemClassToggler(item);"
                @longPress="$emit( 'interact_2', item )"
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
import SearchPanel                      from "@/components/X/SearchBox/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M4 extends Vue {

// -- =====================================================================================

@Prop() vividBG: boolean;

// -- =====================================================================================

data = [];
visibility = "collapsed";

// -- =====================================================================================

get outputBoxClass () {
    return this.vividBG ? 'outputBox transparent' : 'outputBox';
}

// -- =====================================================================================

init ( data: TS.ItemFound[] = [] ) {
    this.data = data;
    this.visibility = data.length ? "visible" : "collapsed";
}

// -- =====================================================================================

itemClasser ( item: TS.ItemFound ) {
    let itemClass = "baseClass";
    if ( item.flags.isCached ) itemClass += " cached";
    if ( item.flags.isHeader ) itemClass += " header";
    return itemClass;
}

// -- =====================================================================================

isAddressed ( item: TS.ItemFound) {
    return item.flags.address ? 'address' : 'hidden';
}

// -- =====================================================================================

itemClassToggler ( item: TS.ItemFound ) {
    item.flags.isCached = !item.flags.isCached;
    item.flags.isBounded = !item.flags.isBounded;
    this.$forceUpdate();
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
        background-color: #1d1e1f;
        color: #8b8b8b;
    }

    .Smoky .baseClass {
        background-color: #d8d8d8;
        color: #0c85aa;
    }

    .CoolGreen .ayah {
        color: #a0c4cf;
    }
    .Smoky .ayah {
        color: #0c85aa;
    }

/* ------------------------------------------- */
    .CoolGreen .header,
    .Smoky .header {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .CoolGreen .header .ayah,
    .Smoky .header .ayah{
        color: #cacaca;
    }

    .CoolGreen .address,
    .Smoky .address{
        visibility: visible;
        font-size: 8;
        opacity: .8;
        padding: 10 0 0 0;
    }

    .CoolGreen .address {
        color: #037269;
    }

    .Smoky .address {
        color: #037269;
    }

/* ------------------------------------------- */
    .CoolGreen .cached {
        background-color: #020202;
    }
    .Smoky .cached {
        background-color: #1f2020;
    }

    .CoolGreen .cached .ayah,
    .Smoky .cached .ayah{
        text-decoration: line-through;
        color: #393a3b;
    }

/* ------------------------------------------- */
    .transparent {
        background-color: transparent;
        padding: 17 5 17 20;
    }
    .hidden {
        visibility: collapse;
    }

</style>