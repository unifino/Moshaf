<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="unityBox" ref="unityBox" rows="44,88,6*,4*,100">

<!---------------------------------------------------------------------------------------->

    <GridLayout 
        row=2 
        columns="7*,23*" 
        :visibility="$store.state.search_ON ? 'hidden' : 'visible'"
    >

        <StackLayout col=0 marginLeft=20 verticalAlignment="middle" >
            <myButton 
                :bClass="'button ' + ( $store.state.appConfig.darkMode ? 'fas' : 'far' )"
                icon="f0eb"
                @tap=darkThemeToggler
                margin=5
            />
            <myButton bClass="button fas" icon="f559" @tap="refresh" margin=5 />
        </StackLayout>

        <GridLayout col=1 rows="*,auto,auto,*" orientation="vertical">
            <Saheb ref="Saheb_Q" row=1 source="Q" />
            <Saheb ref="Saheb_H" row=2 source="H" />
        </GridLayout>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=4 orientation="horizontal" horizontalAlignment="center" >

        <myButton 
            v-for="(button,i) in buttons" 
            :key="i"
            :bClass="'button big fas ' + button.class"
            :icon="button.icon"
            @tap="button.f1()"
            @longPress="button.f2()"
        />

    </StackLayout>

<!---------------------------------------------------------------------------------------->

    <SearchPanel
        width="300"
        row=1
        rowSpan=3
        ref="searchPanel"
        :hashTagButton="true"
        :exchangeButton="true"
        @orderByParent_1="item => openItem( item.source ,item.id )"
        source="Q"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { Najawa }                       from "@/db/N/Al-Najawa"
import Saheb                            from "@/components/U/Saheb.vue"
import DarkTheme                        from "@/components/U/DarkTheme.vue"
import myButton                         from "@/components/X/myButton.vue"
import { route }                        from "@/mixins/router"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Saheb, myButton, SearchPanel }
} )

// -- =====================================================================================

export default class Unity extends Vue {

// -- =====================================================================================

SearchPanel: SearchPanel; 
buttons = [
    { icon: 'f5bb', class: '', f1: () => this.f( 0, "Paper" )  , f2: () => {}           } ,
    { icon: 'f02d', class: '', f1: () => this.f( 1, "Base_00" ), f2: () => this.saheb() } ,
    { icon: 'f67f', class: '', f1: () => this.f( 2, "Base_01" ), f2: () => {}           } ,
];

f ( buttonId: number, page: TS.here ) {
    this.buttons[ buttonId ].class = "pressed";
    setTimeout( () => this.buttons[ buttonId ].class = "", 300 );
    route( page );
}

// -- =====================================================================================

refresh () {
    ( this.$refs.Saheb_Q as Saheb ).refresh();
    ( this.$refs.Saheb_H as Saheb ).refresh();
};

// -- =====================================================================================

mounted () {
    this.SearchPanel = this.$refs.searchPanel as SearchPanel;
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Unity";
    this.SearchPanel.display( null, null, true );
    TM.themePatcher( this );
}

// -- =====================================================================================

darkThemeToggler () {
    let newThem: TS.ThemeName = store.state.appConfig.darkMode ? "Smoky" : "CoolGreen";
    TM.themeApplier( newThem, this );
}

// -- =====================================================================================

saheb () {
    tools.toaster( "اللَّـهُمَّ صَلِّ عَلَى مُحَمَّد وآلِ مُحَمَّد", "long" );
    route( "Qertas", { id: tools.saheb( "Q" ) } );
}

// -- =====================================================================================

openItem ( source: TS.Source, id: number ) {

    // .. reset searchPanel;
    this.SearchPanel.display( null, null, true );

    switch ( source ) {
        case "Q": route( "Qertas", { id: id } ); break;
        case "H": route( "Paper" , { id: id } ); break;
    }

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .unityBox {
        padding: 44 0;
    }

    .CoolGreen .unityBox {
        background-color: #08332f;
    }

    .Smoky .unityBox {
        background-color: #e6e6e6;
    }

/* ------------------------------------------- */
    .button {
        text-align: center;
        font-size: 23px;
        width: 50;
        height: 50;
        margin: 3 7;
        border-width: 1;
        color:#cfe9f0;
        border-radius: 50;
    }

    .big {
        font-size: 30px;
        width: 65;
        height: 65;
        border-radius: 10;
    }

    .CoolGreen .button {
        color:#1ed2d8;
        border-color: #1f2422;
        background-color: #273b31;
    }

    .Smoky .button {
        color:#1a848b;
        border-color: #89c0c4;
        background-color: #cfe9f0;
    }

/* ------------------------------------------- */
    .CoolGreen .pressed {
        background-color: #333636;
    }

    .Smoky .pressed {
        background-color: #3d9ca1;
        color: white;
    }
</style>