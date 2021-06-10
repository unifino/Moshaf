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
search_CH: TS.searchChannels = null;
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
                        this.display_OFF();
                    }
                }
                else {
                    ( e as any ).cancel = true;
                    this.display_OFF();
                }

            }

            if ( this.activeMode === "T" ) this.display_RESET();

        },
    );

    // .. check if this SearchPanel has been wrapped bt an IntuitivePanel
    if ( !Object.keys( (<any>this.IntuitivePanel).$refs ).includes( "intuitivePanel" ) )
        this.IntuitivePanel = null;

}

// -- =====================================================================================

iOI () {

    let source = this.IntuitivePanel.source,
        id = this.IntuitivePanel.id,
        items = tools.getBounds( source, id ).filter( x => x.source !== "T" );

    return { source: source, id: id, items: items }

}

// -- =====================================================================================

iPD_Updater ( data: TS.ItemFound[], target: TS.DisplayTypes, chanel: TS.searchChannels ) :
[ TS.ItemFound[], TS.DisplayTypes, TS.searchChannels ] {

    // .. Special Steps for Intuitive_Panel (if detects)
    if ( !this.IntuitivePanel ) return [ data, target, chanel ]

    // .. get new Data
    let inf = this.iOI();

    // .. let out header itself [ not in Flex_B ]
    if ( target !== "Flex_B" )
        data = data.filter( x => !( x.source === inf.source && x.id === inf.id ) );

    // .. update flags
    for ( let p of data )
        for ( let q of inf.items )
            if ( p.source === q.source && p.id === q.id )
                p.flags.isBounded = true;

    return [ data, target, chanel ];

}

// -- =====================================================================================

display_ON ( data: TS.ItemFound[], target: TS.DisplayTypes, chanel: TS.searchChannels ) {

    // .. general reset
    this.display_OFF();

    // .. Special Steps for Intuitive_Panel (if detects)
    [ data, target, chanel ] = this.iPD_Updater( data, target, chanel );

    // .. set Data on Target
    ( <any>this.$refs[ target ] ).init( data );
    // .. register chanel
    this.search_CH = chanel;
    // .. register state
    this.activated = ( !!data && !!data.length );

    // .. reset activeMode;
    if ( !this.activated ) this.activeMode = this.defaultActiveMode;

    // .. patch for unity
    this.patchUnity();

}

// -- =====================================================================================

display_RESET () {

    // .. general reset
    this.display_OFF();

    // .. special-step for Intuitive_Panel
    if ( this.IntuitivePanel ) {
        this.display_ON( this.iOI().items, "Flex_B", null );
        let Flex_B = ( this.$refs.Flex_B as Flex_B );
        if ( Flex_B.newCommentVisible ) Flex_B.addComment( "" );
    }

    // .. register state
    this.activated = false;
    this.activeMode = this.defaultActiveMode;

    // .. patch for unity
    this.patchUnity();

}

// -- =====================================================================================

display_OFF () {
    let outputs: TS.DisplayTypes[] = [ "List_1", "List_2", "Flex_T", "Flex_B" ];
    // ..  reset
    for ( let output of outputs ) ( <any>this.$refs[ output ] ).init();
    // .. register state
    this.search_CH = null;
    this.activated = false;
    this.patchUnity();
}

// -- =====================================================================================

patchUnity () {
    let unity = this.$parent.$parent as Unity;
    try { unity.unity_v( this.activated ? 'hidden' : 'visible' ) } catch {}
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