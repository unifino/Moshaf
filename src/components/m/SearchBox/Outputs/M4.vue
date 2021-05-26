<template>
<GridLayout rows="60,*,44" opacity=0 :visibility="searchMode!=='T'?'visible':'hidden'">

<!---------------------------------------------------------------------------------------->

    <ScrollView row=1>

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <Label 
                v-for="(item,i) in boundedItems"
                :class="boundClasser(item)"
                :key="i"
                :text="item.text"
                textWrap="true"
                @tap="bind( item.idx, item.source, false )"
            />

        </StackLayout>

    </ScrollView>

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

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M4 extends Vue {

// -- =====================================================================================

@Prop() searchMode: TS.SearchMode;

// -- =====================================================================================

boundedItems: TS.FoundContent[] = [];
cachedBounded: string[];
cachedLastID: number;

// -- =====================================================================================

boundClasser ( item: TS.FoundContent ) {
    let boundClass = "boundedItem";
    if ( item.flags.isBounded ) boundClass += " cached";
    if ( item.flags.isHeader ) boundClass += " header";
    return boundClass
}

// -- =====================================================================================

getBoundedItems() : TS.FoundContent[] {

    let origin = "Q_" + store.state.activeAyah;
    let boundedItems: string[] = store.state.cakeBound[ origin ] || [];
    let result: TS.FoundContent[] = [];

    result = boundedItems.map( x => this.boundParser( x ) );
    result = this.cacheBoundParser( result );

    // .. add even origin
    if ( result.length ) result.unshift( {
        id: store.state.activeAyah,
        text: tools.quranTextPreviewer( store.state.activeAyah ),
        source: "Q",
        flags: { isHeader: true }
    } )

    return result;

}

// -- =====================================================================================

boundParser ( item: string ): TS.FoundContent {

    if ( !this.cachedBounded.includes( item ) ) 
        if ( item.slice(0 , 1) !== "T" )
            this.cachedBounded.push( item );

    let source = item.slice(0, 1) as TS.Source;
    let id = Number( item.slice(2) ) as number;

    if ( source === "Q" ) 
        return { id: id, text: tools.quranPreviewer(id), source: source, flags: {} }
    if ( source === "H" ) 
        return { id: id, text: tools.hadithTextPreviewer(id), source: source, flags: {} }

    return null;

}

// -- =====================================================================================

cacheBoundParser ( items: TS.FoundContent[] ) {

    let cached: TS.FoundContent;

    for ( const c of this.cachedBounded ) {
        if ( !items.find( x => c === x.source + "_" + x.id ) ) {
            cached = this.boundParser(c);
            cached.flags.isCached = true;
            items.push( cached );
        }
    }

    return items;

}

// -- =====================================================================================

cacheCtr ( id: number ) {
    console.log(id);
    
    // .. reset cache memory
    if ( this.cachedLastID !== id ) this.cachedBounded = [];
    // .. cache id
    this.cachedLastID = id;
    // .. retrieve bounded data
    this.boundedItems = this.getBoundedItems();

}

// -- =====================================================================================


// -- =====================================================================================

mounted () {}

// -- =====================================================================================


// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
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

</style>