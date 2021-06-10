<template>
<GridLayout :visibility="visibility" :class="outputBoxClass">

<!---------------------------------------------------------------------------------------->

    <ScrollView ref="rail">

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <GridLayout 
                v-for="(item,i) in data"
                :key="i"
                rows="*,auto" 
                @tap="$emit( 'interact_1', item );itemClassToggler(item);"
                @longPress="$emit( 'interact_2', item )"
                :class="itemClasser(item)"
            >

                <Label row=0 :text="item.text" textWrap=true class="mainText" />
                <Label row=1 :text="item.flags.address" :class="isAddressed(item)" />

            </GridLayout>

            <StackLayout>
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
import store                            from "@/store/store"
import IntuitivePanel                   from "@/components/X/Intuitive/Intuitive_Panel.vue"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Flex_B extends Vue {

// -- =====================================================================================

SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

@Prop() vividBG: boolean;

// -- =====================================================================================

data = [];
visibility = "collapsed";
newCommentVisible = false;

// -- =====================================================================================

init ( data: TS.ItemFound[] = [] ) {
    this.data = data;
    this.visibility = this.data.length ? "visible" : "collapsed";
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

    let IntuitivePanel = this.SearchPanel.$parent as IntuitivePanel,
        code_O = IntuitivePanel.source + "_" + IntuitivePanel.id,
        id: number;

    // .. register comment
    id = store.state.comments.push( str ) -1;
    storage.rawBound.push( [ code_O, "C_" +id ] );
    // .. hard registrations
    storage.saveDB( storage.comments_File, store.state.comments );
    storage.saveDB( storage.bound_File, storage.rawBound );

    // .. re-calculation
    store.state.cakeBound = storage.rawBoundConvertor( storage.rawBound );;

    // .. re-Display
    this.SearchPanel.display_RESET();

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

/* ------------------------------------------- */
    .CoolGreen .header,
    .Smoky .header {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

    .CoolGreen .address,
    .Smoky .address{
        visibility: visible;
        font-size: 8;
        opacity: .8;
        padding: 10 0 0 0;
    }

    .CoolGreen .address {
        color: #037269;
    }

    .Smoky .address {
        color: #037269;
    }

    .CoolGreen .comment {
        background-color: #201d05;
        color: white;
    }

    .Smoky .comment {
        background-color: #ece29d;
        color: #5f6466;
    }

    .newComment {
        margin: 5 0 300 0;
    }

/* ------------------------------------------- */
    .CoolGreen .cached {
        background-color: #020202;
    }
    .Smoky .cached {
        background-color: #1f2020;
    }

    .CoolGreen .cached .mainText,
    .Smoky .cached .mainText{
        text-decoration: line-through;
        color: #393a3b;
    }

/* ------------------------------------------- */
    .transparent {
        background-color: transparent;
        padding: 17 5 17 20;
    }
    .hidden {
        visibility: collapse;
    }

</style>