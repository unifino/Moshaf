<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="fx" @tap="panel()">

<!---------------------------------------------------------------------------------------->

    <ScrollView
        class="paper"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
        @tap="panel()"
    >

        <FlexboxLayout 
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

    </ScrollView>

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
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import Kalameh                          from "@/components/X/Kalameh.vue"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, IntuitivePanel }
} )

// -- =====================================================================================

export default class Paper extends Vue {

// -- =====================================================================================

@Prop() id: number;

// -- =====================================================================================

myID: number;

// -- =====================================================================================

hadith: TS.Hadith = {} as any;

// -- =====================================================================================

mounted () {
    this.init( this.id );
    store.state.iPanel_ON = false;
    ( this.$refs.IntuitivePanel as any ).$refs.searchPanel.activeMode = "H";
    ( this.$refs.IntuitivePanel as any ).$refs.searchPanel.defaultActiveMode = "H";
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
    tools.setHistory( "H", id );
}

// -- =====================================================================================

panel () {
    let IntuitivePanel = this.$refs.IntuitivePanel as IntuitivePanel;
    // .. prevent action when it has been already activated | Heading to Lookup!
    if ( !store.state.iPanel_ON && store.state.here === "Paper" ) 
        IntuitivePanel.init( "H", this.myID );
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