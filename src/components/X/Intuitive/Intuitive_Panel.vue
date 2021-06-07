<template>
<GridLayout
    ref="panel"
    class="panel"
    rows="88,*,auto,*,44"
    columns="60,20,*,20"
    @tap="tapPassed"
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

    <GridLayout row=1 rowSpan=3 col=2 ref="searchBoxes" opacity=0>

        <SearchBox
            ref='search_Q'
            :exchangeButton="true"
            @orderByParent="bind"
            @orderByParent_2="shiftTo"
            :vividBG=true
            source="Q"
            :searchLock=false
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
import { asma, Quran }                  from "@/db/Q/Quran"

import Qertas                           from "@/components/00/Qertas.vue"
import Kalameh                          from "@/components/X/Kalameh.vue"
import myButton                         from "@/components/X/myButton.vue"
import SearchBox                        from "@/components/X/SearchBox/Search_Panel.vue"
import { setText }                      from "nativescript-clipboard"
import Output_M4                        from "@/components/X/SearchBox/Outputs/M4.vue"
import { route } from "@/mixins/router"

// -- =====================================================================================

@Component ( {
    components: { myButton, SearchBox, Output_M4 }
} )

// -- =====================================================================================

export default class ToolBar extends Vue {

// -- =====================================================================================

source: TS.Source;
id: number;

buttons = [
    { icon: 'f004', class: ''     , fnc: () => this.toggleFavorite()    } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => this.copy()              } ,
    { icon: 'f1e0', class: 'share', fnc: r  => this.share(r)            } ,
    { icon: 'f292', class: 'tag'  , fnc: () => this.TagModeToggler()    } ,
    { icon: 'f2f5', class: 'exit' , fnc: () => this.exitPanel()         } ,
]

// -- =====================================================================================

mounted () {

    // .. listen for Back-Button
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => {
            if ( store.state.here === "Paper" && store.state.iPanel_ON ) {
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
    store.state.foundData = tools.foundBounds( this.source, this.id );
}

// -- =====================================================================================

favoriteClass ( source: TS.Source, id: number ) {
    this.buttons[0].class = store.state.fav[ source ].includes( id ) ? "favorite" : "";
}

// -- =====================================================================================

tapPassed ( args ) {}

// -- =====================================================================================

menuBox_Animation
async menuCtr ( id: number ) {

    await new Promise( _ => setTimeout( _ , 0 ) );

    let panel = ( this.$refs.panel as any ).nativeView,
        menuBox = ( this.$refs.menuBox as any ).nativeView,
        searchBoxes = ( this.$refs.searchBoxes as any ).nativeView,
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

    z_def.target = searchBoxes;
    z_def.duration = !~id ? 100 : 650;
    z_def.opacity = !~id ? 0 : 1;

    this.menuBox_Animation = new NS.Animation( [ x_def, y_def, z_def ], false );
    this.menuBox_Animation.play().then( () => {
        store.state.iPanel_ON = !!~id;
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
    // .. hard registration
    let fileName = "fav_" + this.source.toLocaleLowerCase();
    storage.saveDB( storage[ fileName + "_File" ], store.state.fav[ this.source ] );
    // .. toggle favButtonClass
    this.favoriteClass( this.source, this.id );

    // .. for Quran
    if ( this.source === "Q" ) {
        tools.toaster( "Code IT" );
        // // .. toggle style
        // let ayahSeq = this.$parent.$parent.$refs[ "kalameh_" + aID ] as Kalameh[];
        // ayahSeq[ ayahSeq.length -1 ].isFav = !~trace;
        // // .. exit
        // store.state.activeAyah = -1;
    }

    this.menuCtr(-1);

}

// -- =====================================================================================

copy () {

    if ( this.id && this.source ) setText( tools.getInfo( this.source, this.id ).text );
    tools.toaster( "متن کپی شد.", "short" );

}

// -- =====================================================================================

share ( opt: boolean ) {

    // let shareString = "";
    // for ( let x of store.state.foundData ) {
    //     if ( shareString.length ) {
    //         shareString += "\n\n ";
    //         for ( let i=0; i<(opt?19:23); i++ ) shareString += "﹋";
    //         shareString += "\n";
    //     }
    //     if ( x.source === "Q" ) {
    //         shareString += tools.quranTextPreviewer( x.id );
    //         shareString += "\n\n";
    //         shareString += tools.quranAddress( x.id );
    //     }
    //     if ( x.source === "H" )
    //         shareString += tools.getSharedText_H( tools.getHadith( x.id ) );
    // }
    // setText( shareString );
    // let msg = "Generated! Optimized for " + ( opt ? "TELEGRAM": "WhatsApp" );
    // tools.toaster( msg, "short" );
}

// -- =====================================================================================

bind ( item: TS.FoundContent ) {

    if ( item.flags.isHeader ) return;

    // .. Toggle Item
    store.state.cakeBound = tools.bound_Q_Toggler( item );

    // .. hard registration
    storage.saveDB( storage.bound_File, storage.rawBound );

}


// -- =====================================================================================

shiftTo ( item: TS.FoundContent ) {

    if ( item.flags.isHeader ) return;

    if ( item.source === "Q" ) {
        store.state.activeAyah = item.id;
        store.state.foundData = tools.bounder_Q();
    }

    if ( item.source === "H" ) {
        // .. patch M4|M3 intuitive
        store.state.activeAyah = -1;
        // .. regular actions
        tools.clearSearchBox( true );
        route( "Base_10", { id: item.id } )
    }

}

// -- =====================================================================================

TagModeToggler () {

    if ( store.state.foundDataSlot === "M3" ) {
        store.state.foundDataSlot = "M4";
        store.state.foundData = tools.bounder_Q();
        store.state.search_IN = "Q";
    }

    else {
        store.state.foundDataSlot = "M3";
        store.state.foundData = tools.getTags();
        store.state.search_IN = "T";
    }

}

// -- =====================================================================================

async exitPanel () {
    await new Promise( _ => setTimeout( _, 10 ) );
    this.menuCtr(-1);
    // .. regular actions
    tools.clearSearchBox( true );
    await new Promise( _ => setTimeout( _, 10 ) );
    tools.clearSearchBox( false );
}

// -- =====================================================================================

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

    .Smoky .button {
        color:#cfe9f0;
        border-color: #9dd0d4;
        background-color: #1a848b;
    }

    .CoolGreen .button {
        color:#919a9c;
        border-color: #2b5b7a;
        background-color: #072429;
    }

    .panel {
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

    .CoolGreen .cached,
    .Smoky .cached {
        text-decoration: line-through;
        background-color: #222324;
        color: #8b8b8b;
    }

    .CoolGreen .origin,
    .Smoky .origin {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .exit {
        transform: rotateY(-180);
    }

    .Smoky .favorite {
        color: #f86459;
    }

</style>