<template>
<GridLayout :visibility="visibility" class="outputBox">

<!---------------------------------------------------------------------------------------->

    <ListView for="item in data">
        <v-template>

            <GridLayout columns="33,2,*" class="tagLine" @tap="openTag(item)">

                <Label col=0 :text="item.flags.count" />
                <StackLayout background="gray" col=1 />
                <Label col=2 :text="item.text" />

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
import store                            from "@/store/store"
import SearchPanel                      from "../Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M2 extends Vue {

// -- =====================================================================================

data = [];
visibility = "collapsed";
SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

init ( data: TS.ItemFound[] = [] ) {
    this.data = data;
    this.visibility = data.length ? "visible" : "collapsed";
}

// -- =====================================================================================

openTag ( tag: TS.ItemFound ) {

    // .. preparing
    // ! chcek this
    // this.SearchPanel.found = [];
    store.state.foundDataSlot = "M4";

    let result: TS.ItemFound[] = [],
        x_codes = store.state.cakeBound[ "T_" + tag.text ] || [];

    // .. convert codes to the content
    for ( let code_X of x_codes ) result.push( tools.bindItem_Generator( code_X ) );
    result = result.filter( x => x );

    this.SearchPanel.display( result, "Flex_2" );

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .Smoky .tagLine {
        /* background-color: #c4c2c2; */
        color: #383838;
        font-size: 16;
        border-radius: 4;
        padding: 4 10;
        margin: 4 0;
        font-family: Amiri-Regular;
    }

</style>