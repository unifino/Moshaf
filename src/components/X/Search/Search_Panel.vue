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
        <List_1 ref="List_1" @interact_1="e => $emit( 'orderByParent_1', e )" />
        <List_2 ref="List_2"  />
        <Flex_T ref="Flex_T"  />
        <Flex_B ref="Flex_B" 
            @interact_1="e => $emit( 'orderByParent_1', e )"
            @interact_2="e => $emit( 'orderByParent_2', e )"
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

import Input                            from "@/components/X/Search/Inputs/Input.vue"
import Random                           from "@/components/X/Search/Buttons/Random.vue"
import Search                           from "@/components/X/Search/Buttons/Search.vue"
import History                          from "@/components/X/Search/Buttons/History.vue"
import HashTag                          from "@/components/X/Search/Buttons/HashTag.vue"
import Dismiss                          from "@/components/X/Search/Buttons/Dismiss.vue"
import Favorite                         from "@/components/X/Search/Buttons/Favorite.vue"
import Exchange                         from "@/components/X/Search/Buttons/Exchange.vue"
import List_1                           from "@/components/X/Search/Outputs/List_1.vue"
import List_2                           from "@/components/X/Search/Outputs/List_2.vue"
import Flex_T                           from "@/components/X/Search/Outputs/Flex_T.vue"
import Flex_B                           from "@/components/X/Search/Outputs/Flex_B.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"


// -- =====================================================================================

@Component ( {
    components: { 
        Input, 
        Search, Dismiss, History, Favorite, HashTag, Exchange, Random,
        List_1, List_2, Flex_T, Flex_B,
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
activeMode: TS.Source = "Q";
defaultActiveMode: TS.Source = "Q";

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

    // .. special-steps for Intuitive_Panel
    if ( this.IntuitivePanel ) {

        let source = this.IntuitivePanel.source,
            id = this.IntuitivePanel.id,
            items = tools.getBounds( source, id ).filter( x => x.source !== "T" );

        // .. reset mode
        if ( reset ) this.display( items, "Flex_B" );

        // .. assign mode
        else {
            // .. let out header itself [ not in Flex_B ]
            if ( target !== "Flex_B" )
                data = data.filter( x => !( x.source === source && x.id === id ) );
            // .. update flags
            for ( let p of data )
                for ( let q of items )
                    if ( p.source === q.source && p.id === q.id )
                        p.flags.isBounded = true;
            // .. set data
            ( <any>this.$refs[ target ] ).init( data );
        }

    }

    // .. not in reset mode
    if ( !reset ) ( <any>this.$refs[ target ] ).init( data );

    // .. register state
    store.state.search_ON = ( !!data && !!data.length );
    if ( !store.state.search_ON ) this.activeMode = this.defaultActiveMode;

}

// -- =====================================================================================

clearSearch () {
    let outputs: TS.DisplayTypes[] = [ "List_1", "List_2", "Flex_T", "Flex_B" ];
    // ..  reset
    for ( let output of outputs ) ( <any>this.$refs[ output ] ).init();
    // .. register state
    store.state.search_ON = false;
}

// -- =====================================================================================

destroyed() {
    this.alive = false;
    store.state.search_CH = null;
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