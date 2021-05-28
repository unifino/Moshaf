<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in $store.state.foundData" >
        <v-template>
            <Label
                :text="item.text"
                textWrap=true
                :class="itemClasser(item)"
                @tap="$emit( 'interact', item )" 
            />
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

/* ------------------------------------------- */
    .CoolGreen .bounded {
        background-color: #0e962b;
        color: white;
        border-radius: 4;
    }

    .Smoky .bounded {
        background-color: #0e962b;
        color: white;
        border-radius: 4;
    }

    .activated {
        visibility: collapse;
    }

</style>