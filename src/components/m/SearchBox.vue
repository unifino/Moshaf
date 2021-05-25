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
            v-if="source==='Q' || source==='H' || source==='N'"
            class="fas button" 
            :text="String.fromCharCode( '0x' + ( result.length ? 'f00d' : 'f002' ) )"
            @tap="result.length ? dismiss( true ) : init( 'search', true )"
        />

        <Label
            v-if="source==='Q' || source==='H'"
            class="fas button" 
            :text="String.fromCharCode( '0x' + 'f1da' )"
            @tap="init( 'history' )"
        />

        <Label
            v-if="source==='Q' || source==='H'"
            class="fas button" 
            :text="String.fromCharCode( '0x' + 'f004' )"
            @tap="init( 'favorite' )"
        />

        <Label
            v-if=exchangeButton
            class="fas button" 
            :text="String.fromCharCode( '0x' + 'f2f1' )"
            @tap="$emit( 'exchange' )"
        />

        <Label
            v-if=hashTagButton
            class="fas button" 
            :text="String.fromCharCode( '0x' + 'f292' )"
            @tap="tagsListRetriever()"
        />

    </StackLayout>


<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 :visibility="result.length?'visible':'hidden'" class="result">

        <ListView for="item in result" >
            <v-template>
                <Label
                    :class="'item' + ( item.isBounded ? ' bounded' : '' )"
                    :text="item.text"
                    textWrap=true
                    @tap="$emit( 'interact', item.idx, source )" 
                />
            </v-template>
        </ListView>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 :visibility="tagsList.length?'visible':'hidden'" class="result">

        <ListView for="item in tagsList" >
            <v-template>
                <GridLayout 
                    columns="33,2,*" 
                    class="tagLine" 
                    @tap="tagPresenter( item.text )"
                >

                    <Label col=0 :text="item.count" />
                    <StackLayout background="gray" col=1 />
                    <Label col=2 :text="item.text" />

                </GridLayout>
            </v-template>
        </ListView>

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=1 :visibility="result_tag.length?'visible':'hidden'">

        <ScrollView verticalAlignment="middle" marginTop="20">

            <FlexboxLayout
                flexWrap="wrap"
                flexDirection="row-reverse"
                justifyContent="flex-start"
                alignItems="center"
            >
                <Label
                    v-for="item in result_tag"
                    :key="item.idx"
                    :class="tagClasser(item)"
                    :text="item.text"
                    textWrap=true
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
import { Hadith }                       from "@/db/H/Al-Hadith"
import Kalameh                          from "@/components/m/Kalameh.vue"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class SearchBox extends Vue {

// -- =====================================================================================

result: TS.Found = [];
result_tag: TS.Found = [];
tagsList: { text: string, count: string }[] = [];
hint: string = "بحث";
performedMode: TS.SearchMode;

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() exchangeButton: boolean;
@Prop() hashTagButton: boolean;

// -- =====================================================================================

mounted() {

    let pad = 140;
    if ( this.exchangeButton ) pad += 23;
    if ( this.hashTagButton  ) pad += 23;
    ( this.$refs.search as any ).nativeView.paddingLeft = pad;

    if ( this.source === "T" ) this.init( "tag" );

}

// -- =====================================================================================

get appendHint () {
    if ( this.source === "Q" ) return " في القرآن";
    if ( this.source === "H" ) return " في الحادیث";
    if ( this.source === "T" ) return " في العناوين";
    if ( this.source === "N" ) return " في النجاوى";
}

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
        case "clear"    : data = [];                                break;
        case "search"   : data = this.search( force );              break;
        case "history"  : data = this.history();                    break;
        case "favorite" : data = this.favorite();                   break;
        case "rescan"   : data = this[ this.performedMode ]( sos ); break;
        default         : tools.toaster( mode + " ???" );           return;
    }

    data = data.sort ( a => a.isBounded ? -1 : 0 );

    this.result = data;

    this.performedMode = mode !== "rescan" ? mode : this.performedMode;

}

// -- =====================================================================================

search ( force=false ) {

    // .. re-tap situation
    if ( !force && this.result.length && this.performedMode === "search" ) return [];

    // .. cancel just for Najawa
    if ( this.source === "N" && force ) {
        ( this.$refs.search as any ).nativeView.text = '';
        this.$emit( 'search', '' );
        return [];
    }

    let found: TS.Found = [],
        item: TS.Found_Item,
        tmp: string,
        n: number;

    let str = ( this.$refs.search as any ).nativeView.text;

    // .. input must be unified!
    str = str.replace( /ی/g, 'ي' );
    str = str.replace( /ک/g, 'ك' );
    str = tools.erabTrimmer( str );

    // ..  just for Quran's Sura's List & Najawa's List
    this.$emit( 'search', str );

    // ..  just for Q & H
    if ( str.length > 3 || force ) {

        if ( this.source === 'Q' ) for ( const i in Quran ) {

            n = Number(i);
            tmp = tools.asmaUnifier( Quran[i].simple );

            if ( tmp.includes( str ) ) {
                item = { 
                    text: tools.quranPreviewer(n),
                    idx: n,
                    isBounded: this.isBounded(n)
                }
                found.push( item );
            }

        }

        if ( this.source === 'H' ) for ( const i in Hadith ) {

            n = Number(i);
            tmp = tools.asmaUnifier( tools.erabTrimmer( Hadith[i].a ) );

            if ( tmp.includes( str ) ) {
                item = { 
                    text: Hadith[i].a,
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

history ( escape?: boolean ) {

    // .. re-tap situation
    if ( !escape && this.result.length && this.performedMode === "history" ) return [];

    let found: TS.Found = [];
    let item: TS.Found_Item;

    if ( this.source === 'Q' ) for ( const w of storage.trace_q ) {
        item = { 
            text: tools.quranPreviewer(w),
            idx: w,
            isBounded: this.isBounded(w)
        };
        found.unshift( item )
    }

    if ( this.source === 'H' ) for ( const w of storage.trace_h ) {
        item = { 
            text: Hadith[w].a,
            idx: w,
            isBounded: this.isBounded(w)
        }
        found.unshift( item )
    }

    return found;

}

// -- =====================================================================================

favorite ( escape?: boolean ) {

    // .. re-tap situation
    if ( !escape && this.result.length && this.performedMode === "favorite" ) return [];

    let found: TS.Found = [];
    let item: TS.Found_Item;

    for ( const f of storage[ 'fav_' + this.source.toLowerCase() ] ) {

        if ( this.source === 'Q' ) item = { 
            text: tools.quranPreviewer(f), 
            idx: f,
            isBounded: this.isBounded(f)
        }

        if ( this.source === 'H' && Hadith[f].a ) item = { 
            text: Hadith[f].a, 
            idx: f,
            isBounded: this.isBounded(f)
        }

        found.unshift( item );

    }

    return found;

}

// -- =====================================================================================

tagsListRetriever () {

    // .. clear other results
    this.result = [];
    this.result_tag = [];
    this.performedMode = null;

    // .. re-tap situation
    if ( this.tagsList.length ) {
        this.tagsList = [];
        return;
    } 

    let tagsListSimple: string[] = [],
        tmpTagsList: { tagName: string, count: number }[] = [],
        tmpID: number;

    for ( const x of storage.bound ) {
        if ( x[0].slice( 0, 1 ) === "T" ) tagsListSimple.push( x[0].slice(2) );
        if ( x[1].slice( 0, 1 ) === "T" ) tagsListSimple.push( x[1].slice(2) );
    }

    tmpTagsList = tagsListSimple.reduce( (soFar, nextOne) => {

        tmpID = soFar.findIndex( x => x.tagName === nextOne );
        // .. count up fot this Tag
        if ( ~tmpID ) soFar[ tmpID ].count++;
        // .. add this Tag
        else soFar.push( { tagName: nextOne, count: 1 } );

        return soFar;

    }, tmpTagsList );

    this.tagsList = tmpTagsList.map( (x,i) => {
        return {
            text: x.tagName,
            count: tools.arabicDigits( x.count + "" ),
        }
    } );

}

// -- =====================================================================================

cachedTags: string[] = [];
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

    for ( let x of storage.bound ) {

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