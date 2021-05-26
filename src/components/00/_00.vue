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
                @tap="open(x[2])"
            />
            <Label
                ref="-1"
                text="صاحب‌الزمان"
                class="saat"
                @tap="open(-1)"
            />
        </FlexboxLayout>

<!---------------------------------------------------------------------------------------->

    </ScrollView>

<!---------------------------------------------------------------------------------------->

    <SearchBox
        row=1
        rowSpan=2
        ref="search"
        @order="item => open( item.id )"
        :hashTagButton="true"
        source="Q"
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
import Kalameh                          from "@/components/m/Kalameh.vue"
import { asma, Quran }                  from "@/db/Q/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import SearchBox                        from "@/components/m/SearchBox/Panel.vue"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Qertas, SearchBox }
} )

// -- =====================================================================================

export default class Base_00 extends Vue {

// -- =====================================================================================

asma = asma;

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.phraseInSearch, 
        newVal => this.search()
    );

}

// -- =====================================================================================

pageLoaded () {
    store.state.here='Base_00';
    TM.themePatcher( this );
}

// -- =====================================================================================

open ( num: number ): void {

    Vue.prototype.$navigateTo( Qertas, {

        frame : "_base_" ,
        props : { me : num },
        backstackVisible : true,
        transition : { name: "slideTop", duration: 300 }

    } );

    store.state.here = "Qertas";

}

// -- =====================================================================================

search () {

    // .. reset asma
    this.asma = asma;
    let limitTo = tools.inFarsiLetters( store.state.phraseInSearch );
    // .. filter asma
    this.asma = this.asma.filter( x => tools.inFarsiLetters( x[1] ).includes( limitTo ) );

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .sura, .saat {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 14;
        padding: -4 3 0 3;
        margin: 2 .5;
        height: 35;
        border-radius: 5;
    }

    .CoolGreen .sura {
        color: #cccccc;
    }

    .Smoky .sura {
        color: #222324;
    }

    .CoolGreen .saat {
        background-color: #498c29;
        background-color: #086439;
        color: #cccccc;
    }

    .Smoky .saat {
        background-color: #75aa1f;
        color: #eeeeee;
    }

    .DarkGreen .saat {
        background-color: #2c3007;
        color: #cccccc;
    }

</style>