<template>
<GridLayout class="saheb" @tap="tapped">

<!---------------------------------------------------------------------------------------->

    <GridLayout >
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
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { route }                        from '@/mixins/router'
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { Najawa }                       from "@/db/N/Al-Najawa"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Saheb extends Vue {

// -- =====================================================================================

@Prop() source: TS.Source;

// -- =====================================================================================

mounted () {

}

// -- =====================================================================================

tapped () {
    if ( this.source === "Q" ) route( "Base_00" );
    if ( this.source === "H" ) route( "Base_10" );
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
    .saheb {
        width: 200;
        height: 110;
        background-color: rgb(10, 49, 75);
        border-radius: 7;
        margin: 5;
    }

</style>