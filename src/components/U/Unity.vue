<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="unityBox" ref="unityBox" rows="6*,4*,100" columns="110,*">

<!---------------------------------------------------------------------------------------->

    <myButton 
        :bClass="'button ' + ( $store.state.appConfig.darkMode ? 'fas' : 'far' )"
        icon="f0eb"
        @tap=darkThemeToggler
        marginLeft=20
    />

<!---------------------------------------------------------------------------------------->

    <GridLayout row=0 col=1 rows="*,auto,auto,*" orientation="vertical">
        <Saheb row=1 source="Q" />
        <Saheb row=2 source="H" />
    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 col=1 >
    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=2 colSpan=2 orientation="horizontal" horizontalAlignment="center" >
        <myButton bClass="button big fas" icon="f5bb" @tap='route( "Base_10" )' />
        <myButton bClass="button big fas" icon="f02d" @tap='route( "Base_00" )' />
        <myButton bClass="button big fas" icon="f67f" @tap='route( "Base_01" )' />
    </StackLayout>

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

// -- =====================================================================================

@Component ( {
    components: { Saheb, myButton }
} )

// -- =====================================================================================

export default class Unity extends Vue {

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Unity";
}

// -- =====================================================================================

async darkThemeToggler () {
    let newThem: TS.ThemeName = store.state.appConfig.darkMode ? "Smoky" : "CoolGreen";
    TM.themeApplier( newThem, this );
}

// -- =====================================================================================

destroyed () {

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

</style>