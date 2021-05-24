<template>
<Page>
<GridLayout class="myPage" rows="44,44,44,*,7" @tap="search_dismiss()">

<!---------------------------------------------------------------------------------------->

    <Day row=3 rowSpan=3 />

<!---------------------------------------------------------------------------------------->

    <SearchBox 
        row=2
        rowSpan=2
        ref="search"
        @search="search"
        @history="history"
        @favorite="favorite"
        @interact="open"
        hint="بحث في الحادیث"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Ghertas                          from "@/components/00/Ghertas.vue"
import { ahadis }                       from "@/db/H/Ahadis"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox.vue"
import Day                              from "@/components/10/Day.vue"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: { SearchBox, Day }
} )

// -- =====================================================================================

export default class Base_10 extends Vue {

// -- =====================================================================================

swipePass;

// -- =====================================================================================

mounted () {
    store.state.here = "Hadis";
}

// -- =====================================================================================

open () {
    console.log("hatef");
}

// -- =====================================================================================

search ( phrase: string, force=false ) {
    ( this.$refs.search as SearchBox ).init( tools.search( "h", phrase, force ) );
}

// -- =====================================================================================

history ( target: 'q'|'h' = 'h' ) {
    ( this.$refs.search as SearchBox ).init( tools.history( target ) );
}

// -- =====================================================================================

favorite ( target: 'q'|'h' = 'h' ) {
    ( this.$refs.search as SearchBox ).init( tools.favorite( target ) );
}

// -- =====================================================================================

search_dismiss () {
    ( this.$refs.search as SearchBox ).dismiss();
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