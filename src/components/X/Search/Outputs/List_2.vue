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
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class List_2 extends Vue {

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

    let result: TS.ItemFound[] = [],
        x_codes = [];

    for ( let p of store.state.cakeBound[ "T_" + tag.text ] ) {
        x_codes.push(p);
        for ( let q of store.state.cakeBound[p] )
            if ( !q.includes( "T_" ) )
                x_codes.push(q);
    }

    // .. convert codes to the content
    for ( let code_X of x_codes ) result.push( tools.getItemPlus( code_X ) );
    result = result.filter( x => x );

    this.SearchPanel.display_ON( result, "Flex_B", null );

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .tagLine {
        font-size: 16;
        border-radius: 4;
        padding: 4 10;
        margin: 4 0;
        font-family: Amiri-Regular;
    }

    .CoolGreen .tagLine {
        /* background-color: #c4c2c2; */
        color: #9c9a8d;
    }

    .Smoky .tagLine {
        /* background-color: #c4c2c2; */
        color: #383838;
    }

</style>