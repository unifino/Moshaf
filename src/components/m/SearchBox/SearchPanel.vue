<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <Input 
        row=0 
        :source="source" 
        :hashTagButton="hashTagButton" 
        :exchangeButton="exchangeButton" 
    />

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Search :source="source" />
        <Dismiss :source="source" />
        <History :source="source" />
        <Favorite :source="source" />
        <HashTag :hashTagButton="hashTagButton" />
        <Exchange :exchangeButton="exchangeButton" />

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <Output_M1 row=1 />
    <Output_M2 row=1 />
    <Output_M3 row=1 />

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

// -- =====================================================================================

@Component ( {
    components: { 
        Input, 
        Search, Dismiss, History, Favorite, HashTag, Exchange,
        Output_M1, Output_M2, Output_M3
    }
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

result: TS.Found = [];
result_tag: TS.Found = [];
tagsList: { text: string, count: string }[] = [];
performedMode: TS.SearchMode;

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() exchangeButton: boolean;
@Prop() hashTagButton: boolean;

// -- =====================================================================================

mounted() {

    if ( this.source === "T" ) this.init( "tag" );

}

// -- =====================================================================================



tagClasser ( item: TS.Found_Item ) {
    let tagClass = 'tag';
    tagClass += item.isBounded ? ' bounded' : '';
    tagClass += item.idx < 0 ? ' cached' : '' ;
    return tagClass
}

// -- =====================================================================================

init ( mode: TS.SearchMode, force?: boolean, escapeReTap?: boolean ) {

    // .. clear tagList
    this.tagsList = [];

    let data: TS.Found;
    let sos: boolean = mode === "search" ? force : escapeReTap;

    if ( this.source === "T" ) {
        data = this.tagFinder();
        this.result_tag = data;
        this.performedMode = "tag";
        return;
    }

    switch ( mode ) {
        // case "clear"    : data = [];                                break;
        // case "search"   : data = this.search( force );              break;
        // case "history"  : data = this.history();                    break;
        // case "favorite" : data = this.favorite();                   break;
        case "rescan"   : data = this[ this.performedMode ]( sos ); break;
        // default         : tools.toaster( mode + " ???" );           return;
    }

    data = data.sort ( a => a.isBounded ? -1 : 0 );

    this.result = data;

    this.performedMode = mode !== "rescan" ? mode : this.performedMode;

}

// -- =====================================================================================

cachedTags: string[] = [];
tagFinder () {

    let found: TS.Found = [],
        item: TS.Found_Item,
        x: [ string, string ],
        maxID = store.state.bounds.length;

    for ( const i in store.state.bounds ) {

        item = null;
        x = store.state.bounds[i];

        if ( x[0].slice( 0, 1 ) === "T" ) item = { 
            text: x[0].slice(2), 
            idx: Number(i),
            isBounded: this.isBounded( x[0].slice(2) )
        }

        else if ( x[1].slice( 0, 1 ) === "T" ) item = { 
            text: x[1].slice( 2 ), 
            idx: Number(i),
            isBounded: this.isBounded( x[1].slice(2) )
        }

        // .. soft registeration ( Unique )
        if ( item && !found.find( x => x.text === item.text ) ) found.push( item );

    }

    // .. cache Tags
    for ( const f of found ) 
        if ( !this.cachedTags.includes( f.text ) ) this.cachedTags.push( f.text );

    // .. add cached Tags
    for ( const t of this.cachedTags ) 
        if ( !found.find( x => x.text === t ) ) 
            found.push( { text: t, idx: -1 *( found.length +maxID ), isBounded: false } );

    found = found.sort( (a,b) => a.text > b.text ? 1 : -1 );

    return found;

}

// -- =====================================================================================

isBounded ( check: number|string ) {

    let state: boolean = false;

    for ( let x of store.state.bounds ) {

        // .. examine first [cell as Ayah] then check second one
        if ( x[0] === "Q_" + store.state.activeAyah )
            if ( Number( x[1].slice(2) ) === check ) 
                state = true;

        // .. state Declared!
        if ( state ) break;

        // .. examine second [cell as Ayah] then chcek first one
        if ( x[1] === "Q_" + store.state.activeAyah )
            if ( Number( x[0].slice(2) ) === check )
                state = true;

        // .. state Declared!
        if ( state ) break;

        // .. examine first [cell as Ayah] is Bound to this Tag
        if ( x[0] === "Q_" + store.state.activeAyah )
            if ( x[1].slice(2) === check ) 
                state = true;

        // .. state Declared!
        if ( state ) break;

        // .. need more options to check even for H_H | ... ones

    }

    return state;

}

// -- =====================================================================================

toggleTag ( tag: string ) {

    // .. examine first [cell as Ayah] and second [cell as Tag] 
    let a = "Q_" + store.state.activeAyah,
        b = "T_" + tag,
        myAyahTagID = store.state.bounds.findIndex( x => x[0] === a && x[1] === b );

    if ( ~myAyahTagID ) store.state.bounds.splice( myAyahTagID, 1 );
    else store.state.bounds.push( [a, b] );

    // .. hard registration
    storage.saveDB( storage.bound_File, store.state.bounds );

    // .. apply it
    this.init( "rescan" );

    // .. toggle style number
    this.toggleBoundedClass( !~myAyahTagID );

    // .. need more options to check even for H_T | ... ones

}

// -- =====================================================================================

toggleBoundedClass ( mode: boolean ) {

    let qertas = this.$parent.$parent.$parent;
    let ayahSeq = qertas.$refs[ "kalameh_" + store.state.activeAyah ] as Kalameh[];
    ayahSeq[ ayahSeq.length -1 ].isBounded = mode;

}

// -- =====================================================================================

tagPresenter ( tagName: string ) {
    console.log(tagName);
}

// -- =====================================================================================

dismiss ( force=false ) {
    console.log("here");
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
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

    .Smoky .tagLine {
        /* background-color: #c4c2c2; */
        color: #383838;
        font-size: 16;
        border-radius: 4;
        padding: 4 10;
        margin: 4 0;
        font-family: Amiri-Regular;
    }

/*                                          */

    .CoolGreen .bounded {
        background-color: #0e962b;
        color: white;
        border-radius: 4;
    }

    .Smoky .bounded {
        background-color: #0e962b;
        color: white;
        border-radius: 4;
    }

</style>