<template>
<Page @navigatedTo="pageLoaded()">

<!---------------------------------------------------------------------------------------->
    <GridLayout @tap="route( 'Unity', null, false );">
        <Image src="res://moshaf" width=165 stretch="aspectFit" />
    </GridLayout>
<!---------------------------------------------------------------------------------------->
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
import { route }                        from '@/mixins/router'
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { Najawa }                       from "@/db/N/Al-Najawa"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Welcome extends Vue {

// -- =====================================================================================

mounted () {

}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Welcome";
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */


</style>