<template>
<Page @navigatedTo="pageLoaded()">
<GridLayout rows="88,44,*,7" width="300">

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        rowSpan=2
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

<!---------------------------------------------------------------------------------------->

        <FlexboxLayout
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="space-around"
            alignItems="center"
        >
            <Label
                v-for="(x,i) in asma"
                :key=i
                :ref="i"
                :text=x[1]
                class="sura"
                @tap="openItem(x[2])"
            />
        </FlexboxLayout>

<!---------------------------------------------------------------------------------------->

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <SearchPanel
        row=1
        rowSpan=2
        ref="searchPanel"
        @orderByParent_1="item => openItem( item.id )"
        @orderByParent_3="text => search( text )"
        :hashTagButton="true"
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
import { asma, Quran }                  from "@/db/Q/Quran"

import Kalameh                          from "@/components/X/Kalameh.vue"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, SearchPanel }
} )

// -- =====================================================================================

export default class Base_00 extends Vue {

// -- =====================================================================================

asma = asma;

// -- =====================================================================================

mounted () {
    ( this.$refs.searchPanel as SearchPanel ).activeMode = "Q";
    ( this.$refs.searchPanel as SearchPanel ).defaultActiveMode = "Q";
}

// -- =====================================================================================

pageLoaded () {
    store.state.here = "Base_00";
    TM.themePatcher( this );
}

// -- =====================================================================================

openItem ( num: number ): void {
    route( "Qertas", { id: num } );
}

// -- =====================================================================================

search ( frase: string ) {

    // .. reset asma
    this.asma = asma;

    // .. filter asma
    if ( frase ) {
        this.asma = this.asma.filter( x => {
            return tools.inFarsiLetters( x[1] ).includes( frase )
        } );
    }

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .sura {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 14;
        padding: -4 3 0 3;
        margin: 2 .5;
        height: 35;
        border-radius: 5;
    }

    .CoolGreen  .sura { color: #cccccc }
    .Smoky      .sura { color: #222324 }
    .Black      .sura { color: #90918d }

</style>