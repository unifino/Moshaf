<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <Input 
        row=0 
        :hashTagButton="hashTagButton" 
        :exchangeButton="exchangeButton" 
    />

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Search   />
        <Dismiss  />
        <History  />
        <Favorite />
        <HashTag :hashTagButton="hashTagButton" />
        <Exchange :exchangeButton="exchangeButton" />

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <Output_M1 row=1 @interact="e => $emit( 'orderByParent', e )" />
    <Output_M2 row=1 />
    <Output_M3 row=1 />
    <Output_M4 row=1 @interact="e => $emit( 'orderByParent', e )"  :transparentBG=transparentBG />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as TS                          from "@/../types/myTypes"
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import Kalameh                          from "@/components/m/Kalameh.vue"
import Input                            from "@/components/m/SearchBox/Input.vue"
import Search                           from "@/components/m/SearchBox/Buttons/Search.vue"
import Dismiss                          from "@/components/m/SearchBox/Buttons/Dismiss.vue"
import History                          from "@/components/m/SearchBox/Buttons/History.vue"
import Favorite                         from "@/components/m/SearchBox/Buttons/Favorite.vue"
import HashTag                          from "@/components/m/SearchBox/Buttons/HashTag.vue"
import Exchange                         from "@/components/m/SearchBox/Buttons/Exchange.vue"
import Output_M1                        from "@/components/m/SearchBox/Outputs/M1.vue"
import Output_M2                        from "@/components/m/SearchBox/Outputs/M2.vue"
import Output_M3                        from "@/components/m/SearchBox/Outputs/M3.vue"
import Output_M4                        from "@/components/m/SearchBox/Outputs/M4.vue"

// -- =====================================================================================

@Component ( {
    components: { 
        Input, 
        Search, Dismiss, History, Favorite, HashTag, Exchange,
        Output_M1, Output_M2, Output_M3, Output_M4
    }
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

result: TS.FoundContent[] = [];
result_tag: TS.FoundContent[] = [];

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() exchangeButton: boolean;
@Prop() hashTagButton: boolean;
@Prop() transparentBG: boolean;

// -- =====================================================================================

mounted() {
    store.state.searchSource = this.source;
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .button {
        font-size: 20;
        width: 44;
        height: 44;
        text-align: center;
        padding: 10 0;
        margin-right: 1;
        margin-left: -5;
    }

    /* .CoolGreen .button {
        color: #9faeb4;
    }

    .Smoky .button {
        color: #b81868;
        color: #606363;
    } */

    .tag {
        border-radius: 4;
        padding: 5 10;
        margin: 3;
        font-size: 17;
    }

    .CoolGreen .tag {
        background-color: #0f1616;
        color: #feffff;
    }

    .Smoky .tag {
        background-color: #323533;
        color: #d8dada;
    }

    .CoolGreen .cached,
    .Smoky .cached {
        text-decoration: line-through;
        color: #8b8b8b;
    }

</style>