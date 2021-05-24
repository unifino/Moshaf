<template>
<GridLayout
    ref="frame"
    class="frame"
    rows="44,*,auto,*,44"
    columns="60,10,*,10"
    v-if="active"
    @tap="tapPassed=true"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView row=2 col=0 ref="menuBox" class="menuBox" orientation="vertical" >

        <StackLayout 
            class="buttonBox"
            orientation="vertical" 
            horizontalAlignment="center" 
            verticalAlignment="center" 
        >

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

    <SearchBox row=1 rowSpan=3 col=2 hint="بحث في القرآن" />

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Ghertas                          from "@/components/00/Ghertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import myButton                         from "@/components/m/myButton.vue"
import SearchBox                        from "@/components/m/SearchBox.vue"
import { asma, Quran }                  from "@/db/Q/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as NS                          from "@nativescript/core"
import { setText }                      from "nativescript-clipboard"

// -- =====================================================================================

@Component ( {
    components: { myButton, SearchBox }
} )

// -- =====================================================================================

export default class ToolBar extends Vue {

// -- =====================================================================================

tapPassed = false;
active = false;

buttons = [
    { icon: 'f004', class: 'fav'  , fnc: () => this.toggleFavorite()    } ,
    // { icon: 'f00c', class: ''     , fnc: () => {}                       } ,
    { icon: 'f0c1', class: 'bind' , fnc: () => this.bind()              } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => this.copy()              } ,
    // { icon: 'f002', class: 'scope', fnc: () => {}                       } ,
]

// -- =====================================================================================

mounted () {

    store.watch(
        state => state.activeAyah, 
        newVal => this.menuCtr( newVal )
    );

}

// -- =====================================================================================

menuBox_Animation
async menuCtr ( id: number ) {

    console.log(id);
    
    this.active = true;
    await new Promise( _ => setTimeout( _ , 0 ) );

    let menuBox = ( this.$refs.menuBox as any ).nativeView,
        frame = ( this.$refs.frame as any ).nativeView,
        x_def: NS.AnimationDefinition = {},
        y_def: NS.AnimationDefinition = {};

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

    this.menuBox_Animation = new NS.Animation( [ x_def, y_def ], false );
    this.menuBox_Animation.play().then( () => this.active = !!~id );

}

// -- =====================================================================================

toggleFavorite () {

    let aID = store.state.activeAyah;
    let trace = storage.fav_q.indexOf( aID );
    // .. add to Favorite
    if ( !~trace ) storage.fav_q.push( aID );
    // .. pop out of Favorite
    else storage.fav_q.splice( trace, 1 );
    // .. Toast it
    tools.toaster( !~trace ? "💚" : "💔" );
    // .. hard registeration
    storage.saveFav_Quran();
    // .. toggle style
    let ayahSeq = this.$parent.$parent.$refs[ "kalameh_" + aID ] as Kalameh[];
    ayahSeq[ ayahSeq.length -1 ].isFav = !~trace;
    // .. exit
    store.state.activeAyah = -1;

}

// -- =====================================================================================
 bind () {
     console.log( store.state.activeAyah);
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


// -- =====================================================================================

destroyed () {}

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

</style>