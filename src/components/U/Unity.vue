<template>
<Page>
<GridLayout ref="unityBox" rows="*,*,*">

<!---------------------------------------------------------------------------------------->

    <GridLayout row=0 background="darkGray" @tap="to_Base_00()">
    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 background="gray" @tap="to_Base_10()">
    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=2 background="darkGray" @tap="to_Base_01()">
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

import Base_00                          from "@/components/00/_00.vue"
import Base_10                          from "@/components/10/_10.vue"
import Base_01                          from "@/components/01/_01.vue"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class template extends Vue {

// -- =====================================================================================

mounted() {}

// -- =====================================================================================

to_Base_00 ( direction: NS.SwipeDirection|null ): void {

    tools.searchBoxResetter();

    Vue.prototype.$navigateTo( Base_00, {

        frame : '_base_',
        backstackVisible : true,
        transition : { name: "flip", duration: 300 } 

    } );

    store.state.search_IN = "Q";

}

// -- =====================================================================================

to_Base_10 (): void {

    tools.searchBoxResetter();

    Vue.prototype.$navigateTo( Base_10, {

        frame : "_base_" ,
        backstackVisible : true,
        transition : { name: "flip", duration: 300 } 

    } );

    store.state.search_IN = "H";

}

// -- =====================================================================================

to_Base_01 (): void {

    tools.searchBoxResetter();

    Vue.prototype.$navigateTo( Base_01, {

        frame : "_base_" ,
        backstackVisible : true,
        transition : { name: "flip", duration: 300 }

    } );

    store.state.search_IN = "N";

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


</style>