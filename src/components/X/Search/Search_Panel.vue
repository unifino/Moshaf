<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <Input
        row=0 
        :hashTagButton="hashTagButton" 
        :exchangeButton="exchangeButton" 
    />

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Search />
        <Dismiss  />
        <History  />
        <Favorite />
        <Random :randomButton="randomButton" />
        <Exchange :exchangeButton="exchangeButton" />
        <!-- <HashTag :hashTagButton="hashTagButton" /> -->

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <GridLayout row=1>
        <List_1 ref="List_1" @interact="e => $emit('orderByParent', e)" />
        <List_2 ref="List_2"  />
        <Flex_1 ref="Flex_1"  />
        <Flex_2 ref="Flex_2" 
            @interact="e => $emit('orderByParent', e)"
            @interact_2="e => $emit('orderByParent_2', e)"
            :vividBG=vividBG 
        />
    </GridLayout>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"
import * as tools                       from "@/mixins/tools"

import Input                            from "@/components/X/Search/Input.vue"
import Random                           from "@/components/X/Search/Buttons/Random.vue"
import Search                           from "@/components/X/Search/Buttons/Search.vue"
import History                          from "@/components/X/Search/Buttons/History.vue"
import HashTag                          from "@/components/X/Search/Buttons/HashTag.vue"
import Dismiss                          from "@/components/X/Search/Buttons/Dismiss.vue"
import Favorite                         from "@/components/X/Search/Buttons/Favorite.vue"
import Exchange                         from "@/components/X/Search/Buttons/Exchange.vue"
import List_1                           from "@/components/X/Search/Outputs/List_1.vue"
import List_2                           from "@/components/X/Search/Outputs/List_2.vue"
import Flex_1                           from "@/components/X/Search/Outputs/Flex_1.vue"
import Flex_2                           from "@/components/X/Search/Outputs/Flex_2.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"


// -- =====================================================================================

@Component ( {
    components: { 
        Input, 
        Search, Dismiss, History, Favorite, HashTag, Exchange, Random,
        List_1, List_2, Flex_1, Flex_2,
    }
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

@Prop() randomButton: boolean;
@Prop() exchangeButton: boolean;
@Prop() hashTagButton: boolean;
@Prop() vividBG: boolean;

// -- =====================================================================================

alive = false;
IntuitivePanel: IntuitivePanel;

// -- =====================================================================================

mounted() {

    this.alive = true;

    // .. listen for Back-Button
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => {
            if ( this.alive && store.state.search_ON ) {
                this.clearSearch();
                ( e as any ).cancel = true;
            }
        },
    );

    this.IntuitivePanel = this.$parent as any;
    if ( !Object.keys( this.IntuitivePanel.$refs ).includes( "intuitivePanel" ) )
        this.IntuitivePanel = null;

}

// -- =====================================================================================


display ( data: TS.ItemFound[], target: TS.DisplayTypes, reset?:boolean ) {

    // .. general reset
    this.clearSearch();

    // .. reset mode
    if ( reset ) {
        if ( this.IntuitivePanel ) {
            let source = this.IntuitivePanel.source;
            let id = this.IntuitivePanel.id;
            this.display( tools.getBounds( source, id ), "Flex_2" );
        }
    }
    // .. assign mode
    else ( <any>this.$refs[ target ] ).init( data );

    store.state.search_ON = ( !!data && !!data.length );

}

// -- =====================================================================================

clearSearch () {
    let outputs: TS.DisplayTypes[] = [ "List_1", "List_2", "Flex_1", "Flex_2" ];
    // ..  reset
    for ( let output of outputs ) ( <any>this.$refs[ output ] ).init();
    // .. register state
    store.state.search_ON = false;
}

// -- =====================================================================================

destroyed() {
    this.alive = false;
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .button {
        font-size: 20;
        width: 44;
        height: 44;
        text-align: center;
        padding: 10 0;
        margin-right: 1;
        margin-left: -5;
    }

    .CoolGreen .button {
        color: #b3b3b3
    }

    .Smoky .button {
        color: #606363
    }

</style>