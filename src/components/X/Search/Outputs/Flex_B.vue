<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView ref="rail">

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

<!---------------------------------------------------------------------------------------->

            <GridLayout
                v-for="(item,i) in data"
                :key="i"
                rows="*,auto"
                @tap="$emit( 'interact_1', item );itemClassToggler(item);"
                @longPress="$emit( 'interact_2', item )"
                :class="itemClasser(item)"
            >

                <Label
                    row=0
                    :text="itemClasser(item).includes('header')?item.fullText:item.text"
                    textWrap=true
                    class="mainText"
                />
                <Label row=1 :text="item.flags.address" :class="isAddressed(item)" />
                <Label row=1 :text="coder(item.id)" class="code" />

            </GridLayout>

<!---------------------------------------------------------------------------------------->

            <Label
                :visibility="translation_Fa ? 'visible':'collapsed'"
                :text="translation_Fa"
                textWrap=true
                class="translation"
            />

            <Label
                :visibility="translation_Ar ? 'visible':'collapsed'"
                :text="translation_Ar"
                textWrap=true
                class="translation"
            />

<!---------------------------------------------------------------------------------------->

            <StackLayout v-if=commentInput>
                <TextField
                    :visibility="newCommentVisible ? 'visible':'collapsed'"
                    ref="newComment"
                    class="baseClass comment newComment"
                    @returnPress="addComment( $event.object.text )"
                    textWrap="true"
                />
                <Label
                    :visibility="newCommentVisible ? 'collapsed':'visible'"
                    text="+ أضف تعليق"
                    @tap="addComment()"
                    class="baseClass comment"
                />
            </StackLayout>

<!---------------------------------------------------------------------------------------->

        </StackLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import { Sadeghi_Fa, Sadeghi_Ar }       from "@/../../db/Q/Translations"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Flex_B extends Vue {

// -- =====================================================================================

@Prop() vividBG: boolean;
@Prop() commentInput: boolean;

// -- =====================================================================================

data: TS.ItemFound[] = [];
visibility = "collapsed";
newCommentVisible = false;
SearchPanel: SearchPanel = this.$parent as any;
IntuitivePanel: IntuitivePanel = this.SearchPanel.$parent as IntuitivePanel;
translation_Fa: string = "";
translation_Ar: string = "";

// -- =====================================================================================

init ( data: TS.ItemFound[] = [] ) {

    this.data = data;
    this.visibility = this.data.length ? "visible" : "collapsed";

    let header_ID = this.data.findIndex( x => x.flags.isHeader );

    if ( ~header_ID && this.data[ header_ID ].source === "Q" ) {
        this.translation_Fa = Sadeghi_Fa[ this.data[ header_ID ].id ];
        this.translation_Ar = Sadeghi_Ar[ this.data[ header_ID ].id ];
    }

}

// -- =====================================================================================

get outputBoxClass () {
    return this.vividBG ? 'outputBox transparent' : 'outputBox';
}

// -- =====================================================================================

itemClasser ( item: TS.ItemFound ) {
    let itemClass = "baseClass";
    if ( item.flags.isHeader ) itemClass += " header";
    if ( item.source === "C" ) itemClass += " comment";
    if ( item.flags.isCached ) itemClass += " cached";
    return itemClass;
}

// -- =====================================================================================

isAddressed ( item: TS.ItemFound) {
    return item.flags.address ? 'address' : 'hidden';
}

// -- =====================================================================================

itemClassToggler ( item: TS.ItemFound ) {
    if ( !item.flags.isHeader ) {
        item.flags.isCached = !item.flags.isCached;
        item.flags.isBounded = !item.flags.isBounded;
        this.$forceUpdate();
    }
}

// -- =====================================================================================

addComment ( str?: string ) {

    let newComment = ( this.$refs.newComment as any ).nativeView,
        rail = ( this.$refs.rail as any ).nativeView;

    if ( typeof str === "string" ) {
        if ( str ) {
            this.registerComment( str );
            // .. reset textFiled
            newComment.text = "";
        }
        this.newCommentVisible = false;
    }
    else {

        this.newCommentVisible = true;
        setTimeout( () => {
            newComment.focus();
            rail.scrollToVerticalOffset( rail.scrollableHeight, true );
        }, 10 );

    }

}

// -- =====================================================================================

registerComment ( str: string ) {

    let IntuitivePanel = this.SearchPanel.$parent as IntuitivePanel;

    // .. hard registrations
    storage.earthActionREC( "Comment", [ IntuitivePanel.source, IntuitivePanel.id, str ] );
    // .. re-calculation
    storage.re_calculation();
    // .. re-Display
    this.SearchPanel.display_RESET();

}

// -- =====================================================================================

coder ( id: number ) {
    return tools.arabicDigits( id.toString() );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .baseClass {
        margin: 5 0;
        padding: 12 16;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .CoolGreen .baseClass {
        background-color: #1d1e1f;
        color: #8b8b8b;
    }

    .Smoky .baseClass {
        background-color: #d8d8d8;
        color: #0c85aa;
    }

    .Black .baseClass {
        background-color: #d8d8d8;
        color: #0c85aa;
    }

/* ------------------------------------------- */
    .CoolGreen .header,
    .Smoky .header,
    .Black .header {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .CoolGreen .translation,
    .Smoky .translation,
    .Black .translation {
        margin: 5 0;
        padding: 12 16;
        background-color: #181a18;
        border-radius: 7;
        border-width: 1;
        border-color: #000000;
        color: #9a9ea0;
    }

    .CoolGreen .address,
    .Smoky .address,
    .Black .address {
        visibility: visible;
        font-size: 8;
        opacity: .8;
        padding: 10 0 0 0;
    }

    .CoolGreen  .address { color: #037269 }
    .Smoky      .address { color: #037269 }
    .Black      .address { color: #037269 }

    .CoolGreen .comment {
        background-color: #201d05;
        color: white;
    }

    .Smoky .comment {
        background-color: #ece29d;
        color: #5f6466;
    }

    .Black .comment {
        background-color: #ece29d;
        color: #5f6466;
    }

    .newComment {
        margin: 5 0 300 0;
    }

/* ------------------------------------------- */
    .CoolGreen  .cached { background-color: #020202 }
    .Smoky      .cached { background-color: #1f2020 }
    .Black      .cached { background-color: #1f2020 }

    .CoolGreen .cached .mainText,
    .Smoky .cached .mainText,
    .Black .cached .mainText {
        text-decoration: line-through;
        color: #393a3b;
    }


    .code {
        font-family: Homa;
        font-size: 7;
        text-align: left;
        padding: 10 0 0 0;
        opacity: .3;
    }
    .CoolGreen  .code { color: #f4e8c4; }
    .Smoky      .code { color: #f4e8c4; }
    .Black      .code { color: #f4e8c4; }

/* ------------------------------------------- */
    .transparent {
        background-color: transparent;
        padding: 17 5 17 20;
    }
    .hidden {
        visibility: collapse;
    }

</style>