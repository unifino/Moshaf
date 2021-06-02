<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in $store.state.foundData" >
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

export default class Output_M1 extends Vue {

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M1" ? 
        'visible' : 'hidden';
}

// -- =====================================================================================

itemClasser ( item: TS.FoundContent ) {

    // .. Patch if activated ( SAME AYAH )
    if ( item.source + "_" + item.id === "Q_" + store.state.activeAyah ) 
        item.flags.isActivated = true;

    // .. regular actions
    let tagClass = 'item';
    if ( item.flags.isActivated ) tagClass += ' activated';
    if ( item.flags.isBounded ) tagClass += ' bounded';
    if ( item.flags.isCached ) tagClass += ' cached';
    return tagClass

}

// -- =====================================================================================

isAddressed ( item: TS.FoundContent) {
    return item.flags.address ? 'address' : 'hidden';
}

// -- =====================================================================================

itemClassToggler ( item: TS.FoundContent ) {
    console.log(item);
    item.flags.isBounded = !item.flags.isBounded;
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