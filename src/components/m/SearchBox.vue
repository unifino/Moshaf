<template>
<GridLayout rows="60,*">
<!---------------------------------------------------------------------------------------->

    <GridLayout row=0>

        <TextField
            ref="search"
            :hint="hint + appendHint"
            class="search"
            @textChange="init( 'search' )"
        />

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <StackLayout row=0 horizontalAlignment="left" orientation="horizontal">

        <Label
            :text="String.fromCharCode( '0x' + ( result.length ? 'f00d' : 'f002' ) )"
            @tap="result.length ? dismiss( true ) : init( 'search', true )"
            class="fas button" 
        />

        <Label
            :text="String.fromCharCode( '0x' + 'f1da' )"
            @tap="init( 'history' )"
            class="fas button" 
        />

        <Label
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

    <GridLayout row=1 v-if=result.length class="result" >

        <ListView for="item in result" >
            <v-template>
                <Label
                    :text="item.text"
                    textWrap=true
                    class="item"
                    @tap="$emit( 'interact', item.idx, source )" 
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
hint: string = "بحث";

// -- =====================================================================================

@Prop() source: TS.Source;
@Prop() exchangeButton: boolean;

// -- =====================================================================================

mounted() {
    ( this.$refs.search as any ).nativeView.paddingLeft = this.exchangeButton ? 170 : 140;
}

// -- =====================================================================================

get appendHint () {
    if ( this.source === "H" ) return " في الحادیث";
    if ( this.source === "Q" ) return " في القرآن";
}

// -- =====================================================================================

init ( mode: TS.SearchMode, force?: boolean ) {
    let data: TS.Found;
    if ( mode === "clear"   )   data = [];
    if ( mode === "search"  )   data = this.search( force );
    if ( mode === "history" )   data = this.history();
    if ( mode === "favorite" )  data = this.favorite();
    this.result = data;
}

// -- =====================================================================================

search ( force=false ) {

    let found: TS.Found = [];
    let str = ( this.$refs.search as any ).nativeView.text;
    console.log(str);
    
    // .. input must be unified!
    str = str.replace( /ی/g, 'ي' );
    str = str.replace( /ک/g, 'ك' );
    str = tools.erabTrimmer( str );

    // ..  jsut for fehrest Quran
    this.$emit( 'search', str );

    if ( str.length > 3 || force ) {

        if ( this.source === 'Q' )
            for ( const i in Quran )
                if ( tools.asmaUnifier( Quran[i].simple ).includes( str ) )
                    found.push( { text: tools.textPreviwer( Number(i) ), idx: Number(i) } );

        if ( this.source === 'H' )
            for ( const i in Ahadis )
                if ( tools.asmaUnifier( tools.erabTrimmer( Ahadis[i].a ) ).includes( str ) )
                    found.push( { text: Ahadis[i].a, idx: Number(i) } );

    }
    
    return found;

}


// -- =====================================================================================

history () {

    let found: TS.Found = [];

    if ( this.source === 'Q' )
        for ( const w of storage.trace_q )
            found.unshift( { text: tools.textPreviwer(w), idx: w } );

    if ( this.source === 'H' )
        for ( const w of storage.trace_h )
            found.unshift( { text: Ahadis[w].a, idx: w } );

    return found;

}

// -- =====================================================================================

favorite () {

    let found: TS.Found = [];

    for ( const f of storage[ 'fav_' + this.source.toLowerCase() ] ) {

        if ( this.source === 'Q' ) {
            found.unshift( { text: tools.textPreviwer( f ), idx: f } );
        }

        if ( this.source === 'H' ) {
            const ref = Ahadis[ f ];
            found.unshift( { text: ref.a, idx: f } );
        }

    }

    return found;

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

</style>