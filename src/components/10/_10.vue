<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="myPage" rows="88,44,*,7">

<!---------------------------------------------------------------------------------------->

    <Day ref="day" row=2 rowSpan=3 />

<!---------------------------------------------------------------------------------------->

    <SearchBox
        ref="search"
        row=1
        rowSpan=2
        @interact="open"
        source="H"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Qertas                           from "@/components/00/Qertas.vue"
import { Hadith }                       from "@/db/H/Al-Hadith"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox.vue"
import Day                              from "@/components/10/Day.vue"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"

// -- =====================================================================================

@Component ( {
    components: { SearchBox, Day }
} )

// -- =====================================================================================

export default class Base_10 extends Vue {

// -- =====================================================================================

swipePass;

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

pageLoaded () {
    store.state.here='Base_10';
    TM.themePatcher( this );
}

// -- =====================================================================================

open ( num: number ) {
    ( this.$refs.day as Day ).show( num );
    ( this.$refs.search as SearchBox ).dismiss( true );
}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .myPage {
        width: 300;
    }

</style>