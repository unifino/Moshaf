<template>
<Page @navigatedTo="pageLoaded();life=true" @navigatingFrom="life=false" >
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
        @orderByParent="item => open( item.id )"
        :hashTagButton="true"
        source="Q"
        :searchLock=life
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
import { asma, Quran }                  from "@/db/Q/Quran"

import Qertas                           from "@/components/00/Qertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import SearchBox                        from "@/components/m/SearchBox/Search_Panel.vue"

// -- =====================================================================================

@Component ( {
    components: { Kalameh, Qertas, SearchBox }
} )

// -- =====================================================================================

export default class Base_00 extends Vue {

// -- =====================================================================================

asma = asma;
life = true;

// -- =====================================================================================

mounted () {

    store.watch(
        state => store.state.fraseInSearch, 
        newVal => { if ( this.life ) this.search( newVal ) }
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