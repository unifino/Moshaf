<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="fx">

<!---------------------------------------------------------------------------------------->

    <ScrollView
        class="paper"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

        <FlexboxLayout 
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="center"
        >
            <Label :text=hadith.from textWrap=true class="name" @tap="copy()" />
            <Label :text=hadith.salam textWrap=true class="name_e" @tap="copy()" />

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

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <GridLayout rowSpan=5 rows="*,230" >
        <GridLayout row=1 @doubleTap="toggleFavorite()" />
    </GridLayout>

    <IntuitivePanel ref="IntuitivePanel" />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"
import Kalameh                          from "@/components/X/Kalameh.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/iPanel.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, IntuitivePanel }
} )

// -- =====================================================================================

export default class Paper extends Vue {

// -- =====================================================================================

@Prop() id;

// -- =====================================================================================

hadith: TS.Hadith = {} as any;

// -- =====================================================================================

mounted () {
    this.init( this.id )
    // store.watch(
    //     state => store.state.activeHadith.length, 
    //     length => this.init( store.state.activeHadith[ length-1 ] )
    // );

}


// -- =====================================================================================

pageLoaded () {
    store.state.here = 'Paper';
    // TM.themePatcher( this );
}

// -- =====================================================================================

init ( id: number = -1 ) {

    if ( ~id ) this.show( id );

    else {
        let rand = tools.saheb( "H" );
        // .. it has been read already
        while ( store.state.memo.H.includes( rand ) ) rand = tools.saheb( "H" );
        // .. show it
        this.show( rand );
    }

    // .. register the ID
    store.state.activeHadith[ store.state.activeHadith.length -1 ] = id;

}

// -- =====================================================================================

show ( id: number ) {

    this.hadith = tools.getHadith( id );

    // .. add new trace
    let old = store.state.memo.H.findIndex( x => x === id );
    if ( ~old ) store.state.memo.H.splice( old, 1 );
    store.state.memo.H.push( id );
    // .. hard registration
    storage.saveDB( storage.trace_h_File, store.state.memo.H, 44 );

}

// -- =====================================================================================

copy () {
    setText( this.hadith.toShare );
    tools.toaster( "حدیث کپی شد.", "short" );
}

// -- =====================================================================================

toggleFavorite () {
    let currentId = store.state.activeHadith[ store.state.activeHadith.length -1 ];
    let trace = store.state.fav.H.indexOf( currentId );
    // .. add to Favorite
    if ( !~trace ) store.state.fav.H.push( currentId );
    // .. pop out of Favorite
    else store.state.fav.H.splice( trace, 1 );
    // .. Toast it
    tools.toaster( !~trace ? "💚" : "💔" );
    storage.saveDB( storage.fav_h_File, store.state.fav.H );
}

// -- =====================================================================================

popLastTrace () {
    // .. remove last trace
    store.state.memo.H.pop();
    // .. hard registration
    storage.saveDB( storage.trace_h_File, store.state.memo.H );
    // .. notify the action
    tools.toaster( "pop!", "short" );
}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .paper {
        height: 72%;
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

    .CoolGreen .hadith {
        color: #d8d8d8;
    }

    .Smoky .hadith {
        color: #1e2224;
    }

    .CoolGreen .green {
        color: #498c29;
    }

    .Smoky .green {
        color: #3e9217;
    }

    .farsi {
        margin: 20;
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 13;
    }

    .CoolGreen .farsi {
        color: #c5c5c5;
    }

    .Smoky .farsi {
        color: #333333;
    }

    .name, .name_e {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 18;
        margin-bottom: 30;
        height: 50;
    }

    .CoolGreen .name {
        color: #498c29;
    }

    .Smoky .name {
        color: #62922b;
    }

    .name_e {
        height: 20;
        margin-top: 14.4;
        margin-right: 3;
        font-size: 23;
        font-family: Alaem;
        color: #5b8814;
    }

    .CoolGreen .name_e {
        color: #498c29;
    }

    .Smoky .name_e {
        color: #4e791d;
    }

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

</style>