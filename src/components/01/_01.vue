<template>
<Page @navigatedTo="pageLoaded()" >
<GridLayout class="myPage" rows="88,44,*,72" >

<!---------------------------------------------------------------------------------------->

    <ListView marginTop=20 row=2 for="(najwa, idx) in najawa" >
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
        row=1
        rowSpan=2
        @search="search"
        source="N"
        :searchLock=!life
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
import { route }                        from '@/mixins/router'
import { Najawa }                       from "@/db/N/Al-Najawa"
import SearchBox                        from "@/components/X/SearchBox/Search_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { SearchBox }
} )

// -- =====================================================================================

export default class Base_01 extends Vue {

// -- =====================================================================================

najawa: { title: string, content: string }[] = [];
found = [];
life = true;

// -- =====================================================================================

mounted () {

    this.najawa = Najawa;

    store.watch(
        state => store.state.fraseInSearch, 
        newVal => { if ( this.life ) this.search( newVal ) }
    );

}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Base_01";
    TM.themePatcher( this );
}

// -- =====================================================================================

search ( frase: string ) {

    // .. reset Najawa
    this.najawa = Najawa;
    // .. filter Najawa
    if ( frase ) {
        this.najawa = this.najawa.filter( x => {
            return tools.inFarsiLetters( x.title ).includes( frase )
        } );
    }

}

// -- =====================================================================================

open ( num: number ): void {
    route ( "Najwa", { najwaID : num } )
}

// -- =====================================================================================

destroyed () {
    this.life = false;
}

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
        font-size: 14.4;
    }

    .CoolGreen .najwa {
        color: #d8dfe2;
    }

    .Smoky .najwa {
        color: #222324;
    }

</style>