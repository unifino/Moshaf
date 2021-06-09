<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <Input
        ref="input"
        row=0 
        :hashTagButton="hashTagButton" 
        :exchangeButton="exchangeButton" 
        @interact_3="e => $emit( 'orderByParent_3', e )" 
    />

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Search   ref="phrase"                      />
        <Dismiss                                    />
        <History  ref="history"                     />
        <Favorite ref="favorite"                    />
        <Random   :randomButton="randomButton"      />
        <Exchange :exchangeButton="exchangeButton"  />
        <!-- <HashTag :hashTagButton="hashTagButton"     /> -->

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
import Unity                            from "@/components/U/Unity.vue"


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

IntuitivePanel: IntuitivePanel = this.$parent as IntuitivePanel;
activeMode: TS.Source = "Q";
defaultActiveMode: TS.Source = "Q";
search_CH: TS.search_Chanel = null;
activated = false;

// -- =====================================================================================

mounted() {

    // .. listen for Back-Button
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => {
            if ( this.activated ) {

                if ( this.IntuitivePanel ) {
                    if ( this.IntuitivePanel.iPanel_ON ) {
                        ( e as any ).cancel = true;
                        this.clearSearch();
                    }
                }
                else {
                    ( e as any ).cancel = true;
                    this.clearSearch();
                }

            }
        },
    );

    // .. check if this SearchPanel has been wrapped bt an IntuitivePanel
    if ( !Object.keys( (<any>this.IntuitivePanel).$refs ).includes( "intuitivePanel" ) )
        this.IntuitivePanel = null;

}

// -- =====================================================================================

display ( data: TS.ItemFound[], target: TS.DisplayTypes, chanel: TS.search_Chanel, reset?:boolean ) {

    // .. general reset
    this.clearSearch();

    // .. special-steps for Intuitive_Panel
    if ( this.IntuitivePanel ) {

        let source = this.IntuitivePanel.source,
            id = this.IntuitivePanel.id,
            items = tools.getBounds( source, id ).filter( x => x.source !== "T" );

        // .. reset mode
        if ( reset ) this.display( items, "Flex_B", null );

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
    if ( !reset ) {
        ( <any>this.$refs[ target ] ).init( data );
        // .. register chanel
        this.search_CH = chanel;
    }

    // .. register state
    this.activated = ( !!data && !!data.length );
    if ( !this.activated ) this.activeMode = this.defaultActiveMode;

    // .. patch for unity
    try {
        let unity = this.$parent.$parent as Unity;
        unity.unity_v( this.activated ? 'hidden' : 'visible' );
    } catch {}

}

// -- =====================================================================================

clearSearch () {
    let outputs: TS.DisplayTypes[] = [ "List_1", "List_2", "Flex_T", "Flex_B" ];
    // ..  reset
    for ( let output of outputs ) ( <any>this.$refs[ output ] ).init();
    // .. register state
    this.search_CH = null;
    this.activated = false;
}

// -- =====================================================================================

destroyed() {
    this.search_CH = null;
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