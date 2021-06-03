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
        width: 240;
        height: 140;
        border-radius: 7;
        margin: 5;
    }

    .CoolGreen .saheb {
        background-color: #1a1d1d;
    }

    .Smoky .saheb {
        background-color: #2a9de0;
    }

</style>