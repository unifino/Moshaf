<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <GridLayout row=0>

        <TextField
            ref="search"
            :hint="hint || 'بحث'"
            class="search"
            @textChange="commit_search()"
        />

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Label
            :text="String.fromCharCode( '0x' + ( result.length ? 'f00d' : 'f002' ) )"
            @tap="result.length ? dismiss( true ) : commit_search( true )"
            class="fas button" 
        />

        <Label
            :text="String.fromCharCode( '0x' + 'f1da' )"
            @tap="$emit( 'history' )"
            class="fas button" 
        />

        <Label
            :text="String.fromCharCode( '0x' + 'f004' )"
            @tap="$emit( 'favorite' )"
            class="fas button" 
        />

        <Label
            v-if=exchangeButton
            :text="String.fromCharCode( '0x' + 'f2f1' )"
            @tap="$emit( 'exchange' )"
            class="fas button" 
        />

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 v-if=result.length class="result" >

        <ListView for="item in result" >
            <v-template>
                <Label
                    :text="item.text"
                    textWrap=true
                    class="item"
                    @tap="$emit( 'open', item.idx )" 
                />
            </v-template>
        </ListView>

    </GridLayout>

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
import { TextView } from "@nativescript/core"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

result: TS.Found = [];

// -- =====================================================================================

@Prop() hint: string;
@Prop() exchangeButton: boolean;

// -- =====================================================================================

mounted() {
    ( this.$refs.search as any ).nativeView.paddingLeft = this.exchangeButton ? 170 : 140;
}

// -- =====================================================================================

init ( data: TS.Found ) {
    this.result = data;
}

// -- =====================================================================================

commit_search ( force=false ) {
    let phrase = ( this.$refs.search as any ).nativeView.text;
    this.$emit( "search", phrase, force );
}

// -- =====================================================================================

dismiss ( force=false ) {
    if ( force ) {
        this.init( [] );
        ( this.$refs.search as any ).nativeView.text = "";
    }
    ( this.$refs.search as any ).nativeView.dismissSoftInput();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */

    .search {
        padding-left: 140;
        width: 100%;
    }

    .CoolGreen .search {
        color: #a8a8a8;
        placeholder-color: #8f875d;
    }

    .Smoky .search {
        color: #a8a8a8;
        placeholder-color: #8f875d;
    }

    .result {
        padding: 20 24;
        margin-bottom: 44;
        border-radius: 0 0 7 7;
    }

    .item {
        font-family: Amiri-Regular;
        font-family: 12;
        padding: 10;
    }

    .CoolGreen .result {
        background-color: #0f1616;
    }

    .Smoky .result {
        background-color: #dbdbdb;
    }

    .CoolGreen .item {
        color: #e0e0e0;
    }

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
        color: #9faeb4;
    }

    .Smoky .button {
        color: #b81868;
        color: #606363;
    }

</style>