<template>
<GridLayout
    ref="frame"
    class="frame"
    rows="88,*,auto,*,44"
    columns="60,20,*,20"
    v-if="active"
    @tap="tapPassed=true"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView row=2 col=0 ref="menuBox" class="menuBox">

        <StackLayout horizontalAlignment="center" verticalAlignment="center">

            <myButton 
                v-for="(button,i) in buttons" 
                :key="i"
                :myClass="'toolButton fas ' + button.class"
                :myLabel="String.fromCharCode( '0x' + button.icon )"
                @tap=button.fnc
            />

        </StackLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->
    

    <GridLayout 
        row=1 rowSpan=3 col=2 rows="60,*,44"
        ref="boundedBox"
        opacity=0
        :visibility="searchMode!=='T'?'visible':'hidden'"
    >

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

    </GridLayout>

<!---------------------------------------------------------------------------------------->

    <GridLayout row=1 rowSpan=3 col=2 ref="searchBoxes" opacity=0>

        <SearchBox
            ref='search_Q'
            :visibility="searchMode==='Q'?'visible':'hidden'"
            source="Q"
            :exchangeButton="true"
            @interact="bind"
            @exchange="searchMode='H';"
        />

        <SearchBox
            ref='search_H'
            :visibility="searchMode==='H'?'visible':'hidden'"
            source="H"
            :exchangeButton="true"
            @interact="bind"
            @exchange="searchMode='Q'"
        />

        <SearchBox
            ref='search_T'
            :visibility="searchMode==='T'?'visible':'hidden'"
            source="T"
            :exchangeButton="true"
            @interact="bind"
            @exchange="searchMode='Q'"
        />

    </GridLayout>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Qertas                           from "@/components/00/Qertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import myButton                         from "@/components/m/myButton.vue"
import SearchBox                        from "@/components/m/SearchBox/Panel.vue"
import { asma, Quran }                  from "@/db/Q/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as NS                          from "@nativescript/core"
import { setText }                      from "nativescript-clipboard"
import * as TS                          from "@/../types/myTypes"
import { Hadith }                       from "@/db/H/Al-Hadith"
import Output                        from "@/components/m/SearchBox/Outputs/M4.vue"

// -- =====================================================================================

@Component ( {
    components: { myButton, SearchBox, Output }
} )

// -- =====================================================================================

export default class ToolBar extends Vue {

// -- =====================================================================================

tapPassed = false;
active = false;
searchMode: 'Q'|'H'|'T' = 'Q'
boundedItems: TS.FoundContent[] = [];
cachedBounded: string[];
cachedLastID: number;

buttons = [
    { icon: 'f004', class: 'fav'  , fnc: () => this.toggleFavorite()    } ,
    { icon: 'f292', class: 'tag'  , fnc: () => this.createNewTag()      } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => this.copy()              } ,
]

// -- =====================================================================================

mounted () {

    store.watch(
        state => state.activeAyah, 
        newVal => this.menuCtr( newVal )
    );

}

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

menuBox_Animation
async menuCtr ( id: number ) {

    this.active = true;

    if ( ~id ) this.cacheCtr( id );

    await new Promise( _ => setTimeout( _ , 0 ) );

    let menuBox = ( this.$refs.menuBox as any ).nativeView,
        frame = ( this.$refs.frame as any ).nativeView,
        searchBoxes = ( this.$refs.searchBoxes as any ).nativeView,
        boundedBox = ( this.$refs.boundedBox as any ).nativeView,
        x_def: NS.AnimationDefinition = {},
        y_def: NS.AnimationDefinition = {},
        z_def: NS.AnimationDefinition = {},
        w_def: NS.AnimationDefinition = {};

    if ( this.menuBox_Animation ) this.menuBox_Animation.cancel();

    x_def.target = menuBox;
    x_def.curve = NS.Enums.AnimationCurve.ease,
    x_def.duration = 300;
    x_def.translate = { x: !~id ? -23 : 14, y: 0 };
    x_def.opacity = !~id ? 0 : 1;

    y_def.target = frame;
    y_def.curve = NS.Enums.AnimationCurve.ease,
    y_def.duration = 300;
    y_def.backgroundColor = new NS.Color( !~id ? "#000e1111" : "#bb0e1111" );

    z_def.target = searchBoxes;
    z_def.curve = NS.Enums.AnimationCurve.ease,
    z_def.delay = !~id ? 0 : 150;
    z_def.duration = !~id ? 100 : 500;
    z_def.opacity = !~id ? 0 : 1;

    w_def = { ...z_def };
    w_def.target = boundedBox;
w_def.opacity =.2;
    this.menuBox_Animation = new NS.Animation( [ w_def, x_def, y_def, z_def ], false );
    this.menuBox_Animation.play().then( () => this.active = !!~id );

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

toggleFavorite () {

    let aID = store.state.activeAyah;
    let trace = store.state.fav.Q.indexOf( aID );
    // .. add to Favorite
    if ( !~trace ) store.state.fav.Q.push( aID );
    // .. pop out of Favorite
    else store.state.fav.Q.splice( trace, 1 );
    // .. Toast it
    tools.toaster( !~trace ? "💚" : "💔" );
    // .. hard registration
    storage.saveDB( storage.fav_q_File, store.state.fav.Q );
    // .. toggle style
    let ayahSeq = this.$parent.$parent.$refs[ "kalameh_" + aID ] as Kalameh[];
    ayahSeq[ ayahSeq.length -1 ].isFav = !~trace;
    // .. exit
    store.state.activeAyah = -1;

}

// -- =====================================================================================

bind ( id: number, source: TS.Source, rescan = true ) {

    // .. isHeader
    if ( id === store.state.activeAyah ) return 0;

    let a = "Q_" + store.state.activeAyah,
        b = source + "_" + id;

    // .. already has been bound => remove it!
    if ( a in store.state.cakeBound && store.state.cakeBound[a].includes(b) ) {

    }
    // .. no Trace has been found => add it!
    else {

    }

    // // .. rescan
    // this.boundedItems = this.getBoundedItems();

    // // .. toggle style number
    // // searchBox.toggleBoundedClass( !~trace );

    // // .. hard registration
    // // storage.saveDB( storage.bound_File, store.state.bounds );

}

// -- =====================================================================================

copy () {

    // .. copy fullText
    let q = Quran[ store.state.activeAyah ];
    let f = q.text +"\n\n" +asma[ q.sura -1 ][1] +" (" +q.sura +") " +" : " +q.ayah;
    setText( tools.arabicDigits( f ) );
    // .. notify the succession
    tools.toaster( "آیه کپی شد.", "short" );
    // .. exit
    store.state.activeAyah = -1;

}

// -- =====================================================================================

createNewTag () {
    this.searchMode = this.searchMode === "T" ? "Q" : "T";
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .frame {
        background-color: #000e1111;
    }

    .menuBox {
        opacity: 0;
    }

    .boundedItem {
        margin: 5 7;
        padding: 12 16;
        background-color: #05263b;
        color: #dbdbdb;
        border-radius: 7;
        line-height: 8;
        font-size: 14;
    }

    .CoolGreen .cached,
    .Smoky .cached {
        text-decoration: line-through;
        background-color: #222324;
        color: #8b8b8b;
    }

    .CoolGreen .origin,
    .Smoky .origin {
        background-color: #0b2e10;
        border-width: 1;
        border-color: #8b8b8b;
        color: #cacaca;
    }

</style>