<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout
    class="fx"
    @tap="paperTapped()"
    @longPress="editorToggeler()"
    @swipe="swipeControl"
    rows="150,*"
>

    <GridLayout row="0" v-if="mode==='edit'">
        <Label class="button" text="تثبیت" @tap="register()" />
    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <ScrollView
        class="paper"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
        @tap="paperTapped()"
        rowSpan="2"
    >

        <FlexboxLayout
            v-if="mode==='normal'"
            ref="PresentationPanel"
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="center"
        >
            <Label :text=hadith.from textWrap=true class="name" />
            <Label :text=hadith.salam textWrap=true class="name_e" />

            <Label class="divider" />
            <Kalameh
                v-for="(kalameh, i) in hadith.kalamat"
                :key=i
                :myText=kalameh.text
                :myType="'hadith' + ( kalameh.isGreen ? ' green' : '' )"
            />

            <Label class="divider" />

            <Label :text=hadith.farsi textWrap=true class="farsi" />
        </FlexboxLayout>

        <EditorPanel
            v-else
            ref="EditorPanel"
            :hadith=hadith
        />

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <IntuitivePanel ref="IntuitivePanel" rowSpan="2" />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import * as NS                          from "@nativescript/core"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import Kalameh                          from "@/components/X/Kalameh.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"
import EditorPanel                      from "@/components/10/Editor.vue"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";
import { route }                        from "@/mixins/router"
import { Hadith }                       from "@/db/H/Al-Hadith"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, IntuitivePanel, EditorPanel }
} )

// -- =====================================================================================

export default class Paper extends Vue {

// -- =====================================================================================

@Prop() id: number;
@Prop() noHistory: boolean;

// -- =====================================================================================

myID: number;
mode: "normal"|"edit" = "normal";

// -- =====================================================================================

hadith: TS.Hadith = {} as any;

// -- =====================================================================================

mounted () {
    let IntuitivePanel = this.$refs.IntuitivePanel as IntuitivePanel;
    let SearchPanel = IntuitivePanel.$refs.searchPanel as SearchPanel;
    this.init( this.id );
    IntuitivePanel.iPanel_ON = false;
    SearchPanel.activeMode = "H";
    SearchPanel.defaultActiveMode = "H";
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = 'Paper';
    TM.themePatcher( this );
}

// -- =====================================================================================

init ( id: number = -1 ) {

    this.myID = id ;

    if ( !~this.myID ) {
        // .. found a new Hadith
        while ( !~this.myID || store.state.memo.H.includes( this.myID ) )
            this.myID = tools.saheb( "H" );
    }

    // .. show it
    this.show( this.myID );

}

// -- =====================================================================================

show ( id: number ) {
    this.hadith = tools.getHadith( id );
    if ( !this.noHistory ) tools.setHistory( "H", id );
}

// -- =====================================================================================

paperTapped () {

    // .. skip Mode
    if ( this.mode === "edit" ) return;

    let IntuitivePanel = this.$refs.IntuitivePanel as IntuitivePanel;
    // .. prevent action when it has been already activated | Heading to Lookup!
    if ( !IntuitivePanel.iPanel_ON && store.state.here === "Paper" ) 
        ( this.$refs.IntuitivePanel as IntuitivePanel ).init( "H", this.myID );

}

// -- =====================================================================================

editorToggeler () {
    this.mode = this.mode === 'normal' ? 'edit' : 'normal';
    if ( this.mode === "normal" ) this.init( this.id );
}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    let id: number = this.id, flipMode: "Right"|"Left";

    if ( args.direction === NS.SwipeDirection.right ) {
        do { id++ }
        while ( !Hadith[id] )
        flipMode = "Left";
    }
    if ( args.direction === NS.SwipeDirection.left  ) {
        do { id-- }
        while ( !Hadith[id] )
        flipMode = "Right";
    }

    if ( this.id !== id ) route( "Paper", { id, flipMode, noHistory: true } );

}

// -- =====================================================================================

async register () {

    // ..  preventing tap action
    await new Promise( _ => setTimeout( _, 50 ) );

    // .. an neat Copy
    let shodowCopy: TS.hadithCell = JSON.parse( JSON.stringify( this.hadith.obj ) );
    delete shodowCopy.aF;
    delete shodowCopy.bF;

    // .. soft register
    store.state.bugPTCD.push( shodowCopy );
    // .. hard register
    storage.saveDB( storage.bugPTCD_File, store.state.bugPTCD );

    // .. exit
    this.mode = "normal";

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .paper {
        height: 63%;
        width: 72%;
    }

    .hadith {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 15.5;
        line-height: 7;
        padding: 3;
        border-radius: 5;
    }

    .CoolGreen  .hadith { color: #d8d8d8 }
    .Smoky      .hadith { color: #1e2224 }
    .Black      .hadith { color: #a8a8a8 }

    .CoolGreen  .green { color: #498c29 }
    .Smoky      .green { color: #3e9217 }
    .Black      .green { color: #3e9217 }

    .farsi {
        margin: 20;
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 13;
    }

    .CoolGreen  .farsi { color: #c5c5c5 }
    .Smoky      .farsi { color: #333333 }
    .Black      .farsi { color: #5e5e5e }

    .name, .name_e {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 18;
        margin-bottom: 30;
        height: 50;
    }

    .CoolGreen  .name { color: #498c29 }
    .Smoky      .name { color: #62922b }
    .Black      .name { color: #62922b }

    .name_e {
        height: 20;
        margin-top: 14.4;
        margin-right: 3;
        font-size: 23;
        font-family: Alaem;
        color: #5b8814;
    }

    .CoolGreen  .name_e { color: #498c29 }
    .Smoky      .name_e { color: #4e791d }
    .BLack      .name_e { color: #4e791d }

    .divider {
        width: 100%;
        height: 1;
    }

    .alaem, .salam {
        font-size: 20;
        font-family: Alaem;
        padding-top: 15;
    }
    .alaem {
        padding: 15 7 0 7;
    }

    .CoolGreen .salam,
    .CoolGreen .alaem {
        color: #4dbae6;
    }

    .Smoky .salam,
    .Smoky .alaem {
        color: #1d80a7;
    }

    .Black .salam,
    .Black .alaem {
        color: #1d80a7;
    }

    .button {
        text-align: center;
        font-family: Amiri-Regular;
        font-size: 14;
        color: whitesmoke;
        background-color: #053c12;
        height: 40;
        width: 85;
        border-radius: 7;
        margin-top: 65;
        padding-top: -1;
    }
</style>