<template>
<GridLayout
    ref="intuitivePanel"
    class="intuitivePanel"
    rows="88,*,auto,*,44"
    columns="60,20,*,20"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView row=2 col=0 ref="menuBox" class="menuBox">

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <myButton
                v-for="(button,i) in buttons" 
                :key="i"
                :bClass="'button fas ' + button.class"
                :icon="button.icon"
                @tap="button.fnc(false)"
                @longPress="button.fnc(true)"
            />

        </StackLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 rowSpan=3 col=2 opacity=0 ref="searchBox">

        <SearchPanel
            ref='searchPanel'
            @orderByParent_1="bind"
            @orderByParent_2="open_item"
            :vividBG=true
            :commentInput=true
            :exchangeButton=true
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
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

import myButton                         from "@/components/X/myButton.vue"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue"
import { setText }                      from "nativescript-clipboard"
import { route } from "@/mixins/router"

// -- =====================================================================================

@Component ( {
    components: { myButton, SearchPanel }
} )

// -- =====================================================================================

export default class IntuitivePanel extends Vue {

// -- =====================================================================================

iPanel_ON: boolean = false;
source: TS.Source;
id: number;
SearchPanel: SearchPanel;

buttons = [
    { icon: 'f004', class: ''     , fnc: () => this.toggleFavorite()    } ,
    { icon: 'f188', class: 'bug'  , fnc: () => this.bugReporter()       } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => this.copy()              } ,
    { icon: 'f1e0', class: 'share', fnc: r  => this.share(r)            } ,
    { icon: 'f292', class: 'tag'  , fnc: () => this.TagModeToggler()    } ,
    { icon: 'f2f5', class: 'exit' , fnc: () => this.exitPanel()         } ,
]

// -- =====================================================================================

mounted () {

    this.SearchPanel = this.$refs.searchPanel as any;

    // .. listen for Back-Button
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => {
            if
            (
                this.iPanel_ON &&
                !this.SearchPanel.activated &&
                ( store.state.here === "Paper" || store.state.here === "Qertas" )
            )
            {
                this.menuCtr(-1);
                ( e as any ).cancel = true;
            }
        },
    );

}

// -- =====================================================================================

init ( source: TS.Source, id: number ) {
    this.source = source;
    this.id = id;
    this.menuCtr( id );
    // .. set initial state of Favorite Button
    this.favoriteClass( this.source, this.id );
    this.SearchPanel.display_RESET();
}

// -- =====================================================================================

favoriteClass ( source: TS.Source, id: number ) {
    this.buttons[0].class = store.state.fav[ source ].includes( id ) ? "favorite" : "";
}

// -- =====================================================================================

menuBox_Animation
async menuCtr ( id: number ) {

    await new Promise( _ => setTimeout( _ , 0 ) );

    let panel = ( this.$refs.intuitivePanel as any ).nativeView,
        menuBox = ( this.$refs.menuBox as any ).nativeView,
        searchBox = ( this.$refs.searchBox as any ).nativeView,
        bgColor: string,
        x_def: NS.AnimationDefinition = {},
        y_def: NS.AnimationDefinition = {},
        z_def: NS.AnimationDefinition = {},
        isDark = store.state.appConfig.darkMode;

    if ( this.menuBox_Animation ) this.menuBox_Animation.cancel();
    if ( ~id ) panel.visibility = "visible";

    // ! [isDark] wont effect if toggle darkMode; [need re-call the function]
    bgColor = !~id ? "#000e1111" : ( isDark ? "#ee0e1111" : "#bb0e1111" );

    x_def.target = panel;
    x_def.duration = !~id ? 550 : 300;
    x_def.backgroundColor = new NS.Color( bgColor );
    x_def.opacity = !~id ? 0 : 1;

    y_def.target = menuBox;
    y_def.duration = 300;
    y_def.curve = NS.Enums.AnimationCurve.easeOut,
    y_def.translate = { x: !~id ? -23 : 14, y: 0 };
    y_def.opacity = !~id ? 0 : 1;

    z_def.target = searchBox;
    z_def.duration = !~id ? 100 : 450;
    z_def.opacity = !~id ? 0 : 1;

    this.menuBox_Animation = new NS.Animation( [ x_def, y_def, z_def ], false );
    this.menuBox_Animation.play().then( () => {
        this.SearchPanel.search_CH = null;
        this.iPanel_ON = !!~id;
        this.tagModeActivated = false;
        if ( !~id ) panel.visibility = "collapsed";
    } );

}

// -- =====================================================================================

toggleFavorite () {

    let trace = store.state.fav[ this.source ].indexOf( this.id );
    // .. add to Favorite
    if ( !~trace ) store.state.fav[ this.source ].push( this.id );
    // .. pop out of Favorite
    else store.state.fav[ this.source ].splice( trace, 1 );
    // .. toggle favButtonClass
    this.favoriteClass( this.source, this.id );
    // .. close panel
    this.menuCtr(-1);
    // .. hard registration
    let fileName = "fav_" + this.source.toLocaleLowerCase();
    storage.saveDB( storage[ fileName + "_File" ], store.state.fav[ this.source ] );

}

// -- =====================================================================================

copy () {

    if ( this.id && this.source ) setText( tools.getInfo( this.source, this.id ).text );
    tools.toaster( "تم نسخ النص", "short" );

}

// -- =====================================================================================

share ( opt: boolean ) {

    let shareString = "";

    for ( let x of tools.getBounds( this.source, this.id ) ) {
        // .. add divider
        if ( shareString.length ) {
            shareString += "\n\n ";
            for ( let i=0; i<(opt?19:23); i++ ) shareString += "﹋";
            shareString += "\n";
        }
        // .. add text
        shareString += tools.getInfo(  x.source, x.id ).text;
    }

    setText( shareString );

    let msg = "Generated! Optimized for " + ( opt ? "TELEGRAM": "WhatsApp" );
    tools.toaster( msg, "short" );

}

// -- =====================================================================================

bind ( item: TS.ItemFound ) {

    if ( item.flags.isHeader ) return;
    // .. Toggle Item
    let code_O = this.source + "_" + this.id;
    let code_X = item.source + "_" + item.id;
    store.state.cakeBound = tools.toggleBound( code_O, code_X );
    // .. hard registration
    storage.saveDB( storage.bound_File, storage.rawBound );

}


// -- =====================================================================================

open_item ( item: TS.ItemFound ) {

    if ( item.flags.isHeader ) return;

    if ( item.source === "Q" ) {
        // if ( store.state.here === "Qertas" )
        //     this.SearchPanel.display( tools.getBounds( "Q", item.id ), "Flex_B", null );
        // if ( store.state.here === "Paper" )
            route( "Qertas", { id: item.id } )
    }

    if ( item.source === "H" ) {
        // if ( store.state.here === "Paper" )
        //     this.SearchPanel.display( tools.getBounds( "H", item.id ), "Flex_B", null );
        // if ( store.state.here === "Qertas" )
            route( "Paper", { id: item.id } )
    }

}

// -- =====================================================================================

tagModeActivated = false;
TagModeToggler () {

    this.tagModeActivated = !this.tagModeActivated;

    if ( this.tagModeActivated ) {
        let items = tools.getTagItems( this.source, this.id );
        this.SearchPanel.display_ON( items, "Flex_T", "tag" );
        this.SearchPanel.activeMode = "T";
    }

    else this.SearchPanel.display_RESET();

}

// -- =====================================================================================

async exitPanel () {
    await new Promise( _ => setTimeout( _, 10 ) );
    this.menuCtr(-1);
}

// -- =====================================================================================

bugReporter () {
    tools.toaster( "error reported!", "short" );
    storage.saveBug( this.id );
}

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .button {
        text-align: center;
        font-size: 23px;
        width: 50;
        height: 50;
        margin: 3;
        border-width: 1;
        border-radius: 12;
    }

    .CoolGreen .button {
        color:#919a9c;
        border-color: #2b5b7a;
        background-color: #072429;
    }

    .Smoky .button {
        color:#cfe9f0;
        border-color: #9dd0d4;
        background-color: #1a848b;
    }

    .Black .button {
        color:#cfe9f0;
        /* border-color: #9dd0d4; */
        /* background-color: #1a848b; */
    }

    .intuitivePanel {
        background-color: #000e1111;
        visibility: collapse;
    }

    .menuBox {
        opacity: 0;
    }

    .boundedItem {
        margin: 5 7;
        padding: 12 16;
        background-color: #05263b;
        color: #dbdbdb;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .CoolGreen .origin,
    .Smoky .origin,
    .Black .origin {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .CoolGreen .cached,
    .Smoky .cached,
    .Black .cached {
        text-decoration: line-through;
        background-color: #222324;
        color: #8b8b8b;
    }

    .exit {
        transform: rotateY(-180);
    }

    .CoolGreen  .favorite { color: #f86459 }
    .Smoky      .favorite { color: #f86459 }
    .Black      .favorite { color: #f86459 }

    .CoolGreen  .bug { color: #f03535 }
    .Smoky      .bug { color: #f03535 }
    .Black      .bug { color: #f03535 }

</style>