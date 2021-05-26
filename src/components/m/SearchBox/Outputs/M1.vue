<template>
<GridLayout 
    :visibility="$store.state.foundData_M1.length ? 'visible' : 'hidden'" 
    class="result"
>

<!---------------------------------------------------------------------------------------->

    <ListView for="item in $store.state.foundData_M1" >
        <v-template>
            <Label
                :text="item.text"
                textWrap=true
                :class="'item' + ( item.flags.isBounded ? ' bounded' : '' )"
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

export default class Output_M1 extends Vue {


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