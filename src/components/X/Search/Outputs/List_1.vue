<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in data">
        <v-template>
            <GridLayout 
                rows="*,auto"
                :class="itemClasser(item)"
                @tap="$emit( 'interact', item );itemClassToggler(item);"
            >

                <Label row=0 :text="item.text" textWrap=true />
                <Label row=1 :text="item.flags.address" :class="isAddressed(item)" />

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
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class List_1 extends Vue {

// -- =====================================================================================

data = [];
visibility = "collapsed";

// -- =====================================================================================

init ( data: TS.ItemFound[] = [] ) {
    this.data = data;
    this.visibility = data.length ? "visible" : "collapsed";
}

// -- =====================================================================================

itemClasser ( item: TS.ItemFound ) {

    // .. regular actions
    let tagClass = 'item';
    if ( item.flags.isActivated ) tagClass += ' activated';
    if ( item.flags.isBounded ) tagClass += ' bounded';
    if ( item.flags.isCached ) tagClass += ' cached';
    return tagClass

}

// -- =====================================================================================

isAddressed ( item: TS.ItemFound) {
    return item.flags.address ? 'address' : 'hidden';
}

// -- =====================================================================================

itemClassToggler ( item: TS.ItemFound ) {
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
    .item {
        font-family: Amiri-Regular;
        font-family: 12;
        padding: 10;
    }

    .CoolGreen .item {
        color: #e0e0e0;
    }

    .Smoky .item {
        color: #575858;
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

/* ------------------------------------------- */
    .CoolGreen .bounded {
        background-color: #488d3f;
        color: white;
        border-radius: 4;
    }

    .Smoky .bounded {
        background-color: #488d3f;
        color: white;
        border-radius: 4;
    }

    .activated {
        visibility: collapse;
        height: 1;
    }

    .bounded .address {
        color: #141414;
    }

</style>