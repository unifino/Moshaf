<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="unityBox" ref="unityBox" rows="44,88,auto,*,100">

<!---------------------------------------------------------------------------------------->

    <GridLayout row=2 columns="7*,23*" :visibility="visibility_c">

        <StackLayout col=0 marginLeft=20 verticalAlignment="middle" >
            <myButton 
                v-for="(button,i) in side_buttons" 
                :key="i"
                :bClass="'button side ' + button.class"
                :icon="button.icon"
                @tap="button.f()"
            />
        </StackLayout>

        <StackLayout col=1 orientation="vertical" verticalAlignment="middle">
            <Saheb ref="Saheb_Q" source="Q" />
            <Saheb ref="Saheb_H" source="H" />
        </StackLayout>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=4 orientation="horizontal" horizontalAlignment="center" >

        <myButton 
            v-for="(button,i) in big_buttons" 
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
        :hashTagButton="false"
        :exchangeButton="true"
        @orderByParent_1="item => openItem( item.source ,item.id )"
    />

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
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import Saheb                            from "@/components/U/Saheb.vue"
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

visibility_c: "visible"|"hidden" = "visible";
SearchPanel: SearchPanel;
side_buttons = [
    { 
        icon: 'f0eb',
        class: store.state.appConfig.darkMode?'fas':'far',
        f: () => this.darkThemeToggler()
    } ,
    { icon: 'f4d8', class: 'fas', f: () => this.refresh()                   } ,
    { icon: 'f292', class: 'fas', f: () => this.getTagList()                } ,
    { icon: 'f683', class: 'fas', f: () => route( "Qertas", { id: -2 } )    } ,
    { icon: 'f186', class: 'fas', f: () => route( "Qertas", { id: -3 } )    } ,
    { icon: 'f5ad', class: 'fas', f: () => this.toggleFont()                } ,
];

big_buttons = [
    { icon: 'f5bb', class: '', f1: () => this.f( 0, "Paper" )  , f2: () => {}           } ,
    { icon: 'f687', class: '', f1: () => this.f( 1, "Base_00" ), f2: () => this.saheb() } ,
    { icon: 'f684', class: '', f1: () => this.f( 2, "Base_01" ), f2: () => this.sahar() } ,
];

f ( buttonId: number, page: TS.here ) {
    this.big_buttons[ buttonId ].class = "pressed";
    setTimeout( () => this.big_buttons[ buttonId ].class = "", 300 );
    route( page );
}

// -- =====================================================================================

unity_v ( state: "visible"|"hidden" ) { this.visibility_c = state }

// -- =====================================================================================

refresh () {
    ( this.$refs.Saheb_Q as Saheb ).refresh();
    ( this.$refs.Saheb_H as Saheb ).refresh();
};

// -- =====================================================================================

mounted () {
    this.SearchPanel = this.$refs.searchPanel as SearchPanel;
    this.SearchPanel.activeMode = "Q";
    this.SearchPanel.defaultActiveMode = "Q";
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Unity";
    this.SearchPanel.display_RESET();
    TM.themePatcher( this );
}

// -- =====================================================================================

darkThemeToggler () {
    let newThem: TS.ThemeName = store.state.appConfig.darkMode ? "Smoky" : "CoolGreen";
    TM.themeApplier( newThem, this );
}

// -- =====================================================================================

getTagList () {

    // .. re-tap situation
    if ( this.SearchPanel.search_CH === "tag" ) {
        this.SearchPanel.display_RESET();
        return;
    }

    let data = tools.getTagListItems();
    this.SearchPanel.display_ON( data, "List_2", "tag" );
    if ( !data.length ) tools.toaster( "لم يتم العثور على شيء !" );

}

// -- =====================================================================================

saheb () {
    tools.toaster( "اللَّـهُمَّ صَلِّ عَلَى مُحَمَّد وآلِ مُحَمَّد", "long" );
    route( "Qertas", { id: tools.saheb( "Q" ) } );
}


// -- =====================================================================================

sahar () {
    route( "Najwa", { id: 6 } );
}

// -- =====================================================================================

openItem ( source: TS.Source, id: number ) {

    // .. reset searchPanel;
    this.SearchPanel.display_RESET();

    switch ( source ) {
        case "Q": route( "Qertas", { id: id } ); break;
        case "H": route( "Paper" , { id: id } ); break;
    }

}

// -- =====================================================================================

fonts = [
    { active: true , name: "Amiri-Regular"  },
    { active: false, name: "Terafik"        },
    // { active: false, name: "JF Flat"        },
    // { active: false, name: "MADDINA"        },
    { active: false, name: "Homa"           },
];

// -- =====================================================================================

toggleFont () {

    let currentFontID = this.fonts.findIndex( x => x.active );
    let nextFontID = (currentFontID +1) % (this.fonts.length);
    // console.log(this.fonts[ nextFontID ].name);
    store.state.font = this.fonts[ nextFontID ].name;
    for ( let i in this.fonts ) this.fonts[i].active = Number(i) === nextFontID;

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

    .side {
        margin: 5;
    }

</style>