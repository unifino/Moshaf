<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="unityBox" ref="unityBox" rows="25*,15*,15*" columns="7*,17*">

<!---------------------------------------------------------------------------------------->

    <myButton 
        :myClass="'button fas '"
        :myLabel="String.fromCharCode('0x'+($store.state.appConfig.darkMode?'f185':'f186'))"
        @tap=darkThemeToggler
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

    <GridLayout row=2 col=1 >
    </GridLayout>

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
        margin: 3;
        border-width: 1;
        color:#cfe9f0;
        border-radius: 50;
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

</style>