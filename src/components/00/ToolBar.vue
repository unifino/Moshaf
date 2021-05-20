<template>
<GridLayout
    ref="frame"
    rows="*,auto,*"
    columns="auto,*"
>

<!---------------------------------------------------------------------------------------->

    <ScrollView row=1 col=0 ref="menuBox" class="menuBox" orientation="vertical" >

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

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component }               from "vue-property-decorator"
import Ghertas                          from "@/components/00/Ghertas.vue"
import Kalameh                          from "@/components/m/Kalameh.vue"
import myButton                         from "@/components/m/myButton.vue"
import { asma, Quran }                  from "@/db/Quran"
import store                            from "@/store/store"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import * as NS                          from "@nativescript/core"

// -- =====================================================================================

@Component ( {
    components: { myButton }
} )

// -- =====================================================================================

export default class Fehrest extends Vue {

// -- =====================================================================================

buttons = [
    { icon: 'f00c', class: ''     , fnc: () => {}           } ,
    { icon: 'f0c1', class: 'bind' , fnc: () => {}           } ,
    { icon: 'f0c5', class: 'copy' , fnc: () => {}           } ,
    { icon: 'f002', class: 'scope', fnc: () => {}           } ,
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

    let menuBox = ( this.$refs.menuBox as any ).nativeView,
        frame = ( this.$refs.frame as any ).nativeView,
        x_def: NS.AnimationDefinition = {},
        y_def: NS.AnimationDefinition = {};

    if ( this.menuBox_Animation ) this.menuBox_Animation.cancel();

    menuBox.visibility = "visible";
    await new Promise( _ => setTimeout( _ , 0 ) );

    x_def.target = menuBox;
    x_def.curve = NS.Enums.AnimationCurve.ease,
    x_def.duration = 300;
    x_def.translate = { x: id === -1 ? -23 : 14, y: 0 };
    x_def.opacity =  id === -1 ? 0 : 1;

    y_def.target = frame;
    y_def.curve = NS.Enums.AnimationCurve.ease,
    y_def.duration = 300;
    y_def.backgroundColor = id === -1 ? 
        new NS.Color( "#00111414" ) :
        new NS.Color( "#88111414" ); 

    this.menuBox_Animation = new NS.Animation( [ x_def, y_def ], false );
    this.menuBox_Animation.play().then( () => {} );

}

// -- =====================================================================================


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
    .menuBox {
        opacity: 0;
        /* color:#111414; */
    }

</style>