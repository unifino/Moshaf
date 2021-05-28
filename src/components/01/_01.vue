<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout class="myPage" rows="44,44,44,44,*,72" >

<!---------------------------------------------------------------------------------------->

    <ListView row=4 for="(najwa, idx) in najawa" >
        <v-template>
            <Label
                :text="najwa.title"
                textWrap=true
                class="najwa"
                @tap="open( idx )" 
            />
        </v-template>
    </ListView>

<!---------------------------------------------------------------------------------------->

    <SearchBox
        ref="search"
        row=2
        rowSpan=2
        @search="search"
        source="N"
    />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TM                          from "@/themes/themeManager"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { Najawa }                       from "@/db/N/Al-Najawa"

import Najwa                            from "@/components/01/Najwa.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import SearchBox                        from "@/components/m/SearchBox/Search_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Najwa, SearchBox }
} )

// -- =====================================================================================

export default class Base_01 extends Vue {

// -- =====================================================================================

najawa: { title: string, content: string }[] = [];
found = [];

// -- =====================================================================================

mounted () {
    this.najawa = Najawa;
}

// -- =====================================================================================

pageLoaded () {
    store.state.here='Base_01';
    TM.themePatcher( this );
}

// -- =====================================================================================

search ( str: string ) {

    // .. reset Najawa
    this.najawa = Najawa;
    // .. filter Najawa
    this.najawa = this.najawa.filter( x => tools.inFarsiLetters( x.title ).includes( str ) );

}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Najwa, {

        frame : "_base_" ,
        props : { najwaID : num },
        backstackVisible : true,
        transition : { name: "slideTop", duration: 300 }

    } );

}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .myPage {
        width: 300;
    }

    .najwa {
        margin: 20;
        font-family: JF Flat;
        text-align: center;
        font-size: 16;
    }

    .CoolGreen .najwa {
        color: #d8dfe2;
    }

    .Smoky .najwa {
        color: #222324;
    }

</style>