<template>
<GridLayout
    ref="frame"
    class="frame"
    rows="88,*,auto,*,44"
    columns="60,20,*,20"
    v-if="active"
    @tap="tapPassed"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView row=2 col=0 ref="menuBox" class="menuBox">

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <myButton 
                v-for="(button,i) in buttons" 
                :key="i"
                :myClass="'toolButton fas ' + button.class"
                :myLabel="String.fromCharCode( '0x' + button.icon )"
                @tap=button.fnc
            />

        </StackLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 rowSpan=3 col=2 ref="searchBoxes" opacity=0>

        <SearchBox
            ref='search_Q'
            :exchangeButton="true"
            @orderByParent="bind"
            :vividBG=true
            source="Q"
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
import Kalameh                          from "@/components/m/Kalameh.vue"
import myButton                         from "@/components/m/myButton.vue"
import SearchBox                        from "@/components/m/SearchBox/Search_Panel.vue"
import { setText }                      from "nativescript-clipboard"
import Output_M4                        from "@/components/m/SearchBox/Outputs/M4.vue"

// -- =====================================================================================

@Component ( {
    components: { myButton, SearchBox, Output_M4 }
} )

// -- =====================================================================================

export default class ToolBar extends Vue {

// -- =====================================================================================

active = false;
buttons = [
    { icon: 'f004', class: 'fav'  , fnc: () => this.toggleFavorite()    } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => this.copy()              } ,
    { icon: 'f292', class: 'tag'  , fnc: () => this.TagModeToggler()    } ,
]

// -- =====================================================================================

mounted () {

    store.watch(
        state => state.activeAyah, 
        newVal => this.menuCtr( newVal )
    );

    // .. replace Bounded Items as Default
    store.watch(
        state => state.foundDataSlot, 
        newVal => {
            if ( !newVal && ~store.state.activeAyah ) 
                store.state.foundData = tools.bounder_Q() 
        }
    );

}

// -- =====================================================================================

tapPassed ( args ) {
    
}

// -- =====================================================================================

menuBox_Animation
async menuCtr ( id: number ) {

    this.active = true;

    await new Promise( _ => setTimeout( _ , 0 ) );

    let menuBox = ( this.$refs.menuBox as any ).nativeView,
        frame = ( this.$refs.frame as any ).nativeView,
        searchBoxes = ( this.$refs.searchBoxes as any ).nativeView,
        x_def: NS.AnimationDefinition = {},
        y_def: NS.AnimationDefinition = {},
        z_def: NS.AnimationDefinition = {},
        w_def: NS.AnimationDefinition = {};

    if ( this.menuBox_Animation ) this.menuBox_Animation.cancel();

    x_def.target = menuBox;
    x_def.curve = NS.Enums.AnimationCurve.ease,
    x_def.duration = 300;
    x_def.translate = { x: !~id ? -23 : 14, y: 0 };
    x_def.opacity = !~id ? 0 : 1;

    y_def.target = frame;
    y_def.curve = NS.Enums.AnimationCurve.ease,
    y_def.duration = 300;
    y_def.backgroundColor = new NS.Color( !~id ? "#000e1111" : "#bb0e1111" );

    z_def.target = searchBoxes;
    z_def.curve = NS.Enums.AnimationCurve.ease,
    z_def.delay = !~id ? 0 : 150;
    z_def.duration = !~id ? 100 : 500;
    z_def.opacity = !~id ? 0 : 1;

    this.menuBox_Animation = new NS.Animation( [ x_def, y_def, z_def ], false );
    this.menuBox_Animation.play().then( () => this.active = !!~id );

}

// -- =====================================================================================

toggleFavorite () {

    let aID = store.state.activeAyah;
    let trace = store.state.fav.Q.indexOf( aID );
    // .. add to Favorite
    if ( !~trace ) store.state.fav.Q.push( aID );
    // .. pop out of Favorite
    else store.state.fav.Q.splice( trace, 1 );
    // .. Toast it
    tools.toaster( !~trace ? "💚" : "💔" );
    // .. hard registration
    storage.saveDB( storage.fav_q_File, store.state.fav.Q );
    // .. toggle style
    let ayahSeq = this.$parent.$parent.$refs[ "kalameh_" + aID ] as Kalameh[];
    ayahSeq[ ayahSeq.length -1 ].isFav = !~trace;
    // .. exit
    store.state.activeAyah = -1;

}

// -- =====================================================================================

bind ( item: TS.FoundContent ) {

    if ( item.flags.isHeader ) return;

    // .. Toggle Item
    store.state.cakeBound = tools.bound_Q_Toggler( item );
    store.state.foundData = tools.bounder_Q();
    tools.searchBoxResetter();

    // .. hard registration
    storage.saveDB( storage.bound_File, storage.rawBound );

}

// -- =====================================================================================

copy () {

    // .. copy fullText
    let q = Quran[ store.state.activeAyah ];
    let f = q.text +"\n\n" +asma[ q.sura -1 ][1] +" (" +q.sura +") " +" : " +q.ayah;
    setText( tools.arabicDigits( f ) );
    // .. notify the succession
    tools.toaster( "آیه کپی شد.", "short" );
    // .. exit
    store.state.activeAyah = -1;

}

// -- =====================================================================================

TagModeToggler () {
    if ( store.state.foundDataSlot === "M3" ) {
        store.state.foundDataSlot = "M4";
        store.state.foundData = tools.bounder_Q();
    }
    else {
        store.state.foundDataSlot = "M3";
        store.state.foundData = tools.getTags();
    }
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .frame {
        background-color: #000e1111;
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

</style>