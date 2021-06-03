<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="unityBox" ref="unityBox" rows="25*,15*,15*" columns="10*,17*">

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
import { route } from "@/mixins/router"

// -- =====================================================================================

@Component ( {
    components: { Saheb }
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

</style>