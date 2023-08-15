<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in data">
        <v-template>
            <GridLayout 
                rows="*,auto"
                :class="itemClasser(item)"
                @tap="$emit( 'interact_1', item );itemClassToggler(item);"
                @longPress="$emit( 'interact_2', item )"
            >

                <Label row=0 :text="item.text" textWrap=true />
                <Label row=1 :text="item.flags.address" :class="isAddressed(item)" />
                <Label row=1 :text="coder(item.id)" class="code"  />

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
import * as tools                       from "@/mixins/tools"
import { StackLayout } from "@nativescript/core";

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

coder ( id: number ) {
    return tools.arabicDigits( id.toString() );
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

    .CoolGreen  .item { color: #e0e0e0 }
    .Smoky      .item { color: #575858 }
    .Black      .item { color: #575858 }

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

    .Black .bounded {
        background-color: #488d3f;
        color: white;
        border-radius: 4;
    }

    .bounded .address {
        color: #141414;
    }

    .code {
        font-family: Homa;
        font-size: 7;
        text-align: left;
        padding: 10 0 0 0;
        opacity: .3;
    }
    .CoolGreen  .code { color: #f4e8c4; }
    .Smoky      .code { color: #f4e8c4; }
    .Black      .code { color: #f4e8c4; }

</style>