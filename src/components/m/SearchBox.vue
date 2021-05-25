<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <GridLayout row=0>

        <TextField
            ref="search"
            :hint="hint + appendHint"
            class="search"
            @textChange="init( 'search' )"
            @returnPress="returnPressed"
        />

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Label
            v-if="source==='Q' || source==='H' || source==='D'"
            :text="String.fromCharCode( '0x' + ( result.length ? 'f00d' : 'f002' ) )"
            @tap="result.length ? dismiss( true ) : init( 'search', true )"
            class="fas button" 
        />

        <Label
            v-if="source==='Q' || source==='H' || source==='D'"
            :text="String.fromCharCode( '0x' + 'f1da' )"
            @tap="init( 'history' )"
            class="fas button" 
        />

        <Label
            v-if="source==='Q' || source==='H' || source==='D'"
            :text="String.fromCharCode( '0x' + 'f004' )"
            @tap="init( 'favorite' )"
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

    <StackLayout row=1 v-if=result.length class="result" >

        <ListView for="item in result" >
            <v-template>
                <Label
                    textWrap=true
                    :text="item.text"
                    :class="'item' + ( item.isBounded ? ' bounded' : '' )"
                    @tap="$emit( 'interact', item.idx, source )" 
                />
            </v-template>
        </ListView>

    </StackLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=1 v-if=result_tag.length >

        <ScrollView orientation="vertical" verticalAlignment="middle" marginTop="20">

            <FlexboxLayout
                flexWrap="wrap"
                flexDirection="row-reverse"
                justifyContent="flex-start"
                alignItems="center"
            >
                <Label
                    v-for="item in result_tag"
                    :key="item.idx"
                    textWrap=true
                    :text="item.text"
                    :class="tagClasser(item)"
                    @tap="toggleTag(item.text)" 
                />

            </FlexboxLayout>

        </ScrollView>

    </StackLayout>

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
import { Ahadis }                       from "@/db/H/Ahadis"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

result: TS.Found = [];
result_tag: TS.Found = [];
hint: string = "بحث";
perfomedMode: TS.SearchMode;

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() exchangeButton: boolean;

// -- =====================================================================================

mounted() {
    ( this.$refs.search as any ).nativeView.paddingLeft = this.exchangeButton ? 170 : 140;
    if ( this.source === "T" ) this.init( "tag" );
}

// -- =====================================================================================

get appendHint () {
    if ( this.source === "Q" ) return " في القرآن";
    if ( this.source === "H" ) return " في الحادیث";
    if ( this.source === "T" ) return " في العناوين";
}

tagClasser ( item: TS.Found_Item ) {
    let tagClass = 'tag';
    tagClass += item.isBounded ? ' bounded' : '';
    tagClass += item.idx < 0 ? ' cached' : '' ;
    return tagClass
}

// -- =====================================================================================

init ( mode: TS.SearchMode, force?: boolean ) {

    let data: TS.Found;

    if ( this.source === "T" ) {
        data = this.tagFinder();
        this.result_tag = data;
        this.perfomedMode = "tag";
        return;
    }

    switch ( mode ) {
        case "clear"    : data = [];                            break;
        case "search"   : data = this.search( force );          break;
        case "history"  : data = this.history();                break;
        case "favorite" : data = this.favorite();               break;
        case "rescan"   : data = this[ this.perfomedMode ]();   break;
        default         : tools.toaster( mode + " ???" );       return;
    }

    data = data.sort ( a => a.isBounded ? -1 : 0 );

    this.result = data;

    this.perfomedMode = mode !== "rescan" ? mode : this.perfomedMode;

}

// -- =====================================================================================

search ( force=false ) {

    // .. re-tap situation
    if ( this.result.length && this.perfomedMode === "search" ) return [];

    let found: TS.Found = [],
        item: TS.Found_Item,
        tmp: string,
        n: number;

    let str = ( this.$refs.search as any ).nativeView.text;

    // .. input must be unified!
    str = str.replace( /ی/g, 'ي' );
    str = str.replace( /ک/g, 'ك' );
    str = tools.erabTrimmer( str );

    // ..  jsut for Quran's Sura's List
    this.$emit( 'search', str );

    if ( str.length > 3 || force ) {

        if ( this.source === 'Q' ) for ( const i in Quran ) {

            n = Number(i);
            tmp = tools.asmaUnifier( Quran[i].simple );

            if ( tmp.includes( str ) ) {
                item = { 
                    text: tools.textPreviwer(n),
                    idx: n,
                    isBounded: this.isBounded(n)
                }
                found.push( item );
            }

        }

        if ( this.source === 'H' ) for ( const i in Ahadis ) {

            n = Number(i);
            tmp = tools.asmaUnifier( tools.erabTrimmer( Ahadis[i].a ) );

            if ( tmp.includes( str ) ) {
                item = { 
                    text: Ahadis[i].a,
                    idx: n,
                    isBounded: this.isBounded(n)
                }
                found.push( item );
            }

        }

    }

    return found;

}


// -- =====================================================================================

history () {

    // .. re-tap situation
    if ( this.result.length && this.perfomedMode === "history" ) return [];

    let found: TS.Found = [];
    let item: TS.Found_Item;

    if ( this.source === 'Q' ) for ( const w of storage.trace_q ) {
        item = { 
            text: tools.textPreviwer(w),
            idx: w,
            isBounded: this.isBounded(w)
        };
        found.unshift( item )
    }

    if ( this.source === 'H' ) for ( const w of storage.trace_h ) {
        item = { 
            text: Ahadis[w].a,
            idx: w,
            isBounded: this.isBounded(w)
        }
        found.unshift( item )
    }

    return found;

}

// -- =====================================================================================

favorite () {

    // .. re-tap situation
    if ( this.result.length && this.perfomedMode === "favorite" ) return [];

    let found: TS.Found = [];
    let item: TS.Found_Item;

    for ( const f of storage[ 'fav_' + this.source.toLowerCase() ] ) {

        if ( this.source === 'Q' ) item = { 
            text: tools.textPreviwer(f), 
            idx: f,
            isBounded: this.isBounded(f)
        }

        if ( this.source === 'H' && Ahadis[f].a ) item = { 
            text: Ahadis[f].a, 
            idx: f,
            isBounded: this.isBounded(f)
        }

        found.unshift( item );

    }

    return found;

}

// -- =====================================================================================

cacheTags: string[] = [];
tagFinder () {

    let found: TS.Found = [],
        item: TS.Found_Item,
        x: [ string, string ],
        maxID = storage.bound.length;

    for ( const i in storage.bound ) {

        item = null;
        x = storage.bound[i];

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

        // .. soft registeration ( Uniqe )
        if ( item && !found.find( x => x.text === item.text ) ) found.push( item );

    }

    // .. cache Tags
    for ( const f of found ) 
        if ( !this.cacheTags.includes( f.text ) ) this.cacheTags.push( f.text );

    // .. add cached Tags
    for ( const t of this.cacheTags ) 
        if ( !found.find( x => x.text === t ) ) 
            found.push( { text: t, idx: -1 *( found.length +maxID ), isBounded: false } );

    found = found.sort( (a,b) => a.text > b.text ? 1 : -1 );

    return found;

}

// -- =====================================================================================

isBounded ( check: number|string ) {

    let state: boolean = false;

    for ( let x of storage.bound ) {

        // .. examine first [cell as Ayah] then chcek second one
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

returnPressed ( event ) {

    // .. Not in Tag-Section!
    if ( this.source !== "T" ) this.init( 'search', true );

    // .. Just in Tag-Section
    else {

        let newTag = event.object.text;

        let a = "Q_" + store.state.activeAyah;
        let b = "T_" + newTag;

        // .. add new Tag ( uniqe )
        if ( !storage.bound.find( x => x[0] === a && x[1] === b ) ) 
            storage.bound.push( [a, b] );

        // .. hard registration
        storage.saveDB( storage.bound_File, storage.bound );

        // .. apply it
        this.init( "rescan" );

    }

}

// -- =====================================================================================

toggleTag ( tag: string ) {

    // .. examine first [cell as Ayah] and second [cell as Tag] 
    let a = "Q_" + store.state.activeAyah,
        b = "T_" + tag,
        myAyahTagID = storage.bound.findIndex( x => x[0] === a && x[1] === b );

    if ( ~myAyahTagID ) storage.bound.splice( myAyahTagID, 1 );
    else storage.bound.push( [a, b] );

    // .. hard registration
    storage.saveDB( storage.bound_File, storage.bound );

    // .. apply it
    this.init( "rescan" );

    // .. need more options to check even for H_T | ... ones

}

// -- =====================================================================================

dismiss ( force=false ) {
    if ( force ) {
        this.init( "clear" );
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