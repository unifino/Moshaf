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

        <Search :searchLock=searchLock />
        <Dismiss  />
        <History  />
        <Favorite />
        <Random :randomButton="randomButton" />
        <HashTag :hashTagButton="hashTagButton" />
        <Exchange :exchangeButton="exchangeButton" />

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <Output_M1 row=1 @interact="e => $emit('orderByParent', e)" />
    <Output_M2 row=1 />
    <Output_M3 row=1 />
    <Output_M4 row=1 @interact="e => $emit('orderByParent', e)" :vividBG=vividBG />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import store                            from "@/store/store"

import Input                            from "@/components/m/SearchBox/Input.vue"
import Random                           from "@/components/m/SearchBox/Buttons/Random.vue"
import Search                           from "@/components/m/SearchBox/Buttons/Search.vue"
import History                          from "@/components/m/SearchBox/Buttons/History.vue"
import HashTag                          from "@/components/m/SearchBox/Buttons/HashTag.vue"
import Dismiss                          from "@/components/m/SearchBox/Buttons/Dismiss.vue"
import Favorite                         from "@/components/m/SearchBox/Buttons/Favorite.vue"
import Exchange                         from "@/components/m/SearchBox/Buttons/Exchange.vue"
import Output_M1                        from "@/components/m/SearchBox/Outputs/M1.vue"
import Output_M2                        from "@/components/m/SearchBox/Outputs/M2.vue"
import Output_M3                        from "@/components/m/SearchBox/Outputs/M3.vue"
import Output_M4                        from "@/components/m/SearchBox/Outputs/M4.vue"

// -- =====================================================================================

@Component ( {
    components: { 
        Input, 
        Search, Dismiss, History, Favorite, HashTag, Exchange, Random,
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
@Prop() randomButton: boolean;
@Prop() exchangeButton: boolean;
@Prop() hashTagButton: boolean;
@Prop() vividBG: boolean;
@Prop() searchLock: boolean;

// -- =====================================================================================

mounted() {
    store.state.search_IN = this.source;
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

    .CoolGreen .button {
        color: #b3b3b3
    }

    .Smoky .button {
        color: #606363
    }

</style>