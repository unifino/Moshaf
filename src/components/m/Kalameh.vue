<template>
<!---------------------------------------------------------------------------------------->

    <Label 
        ref="kalameh"
        :text="myText"
        :class="theType + ( isFav ? ' fav' : '' ) + ( isPressed? ' pressed' : '' )"
        @tap="autoTranslate();$emit( 'tap', myText, myType, aID );"
        @touch=touched
    />

<!---------------------------------------------------------------------------------------->

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
import Lookup                           from "@/components/xx/Lookup.vue"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Kalameh extends Vue {

// -- =====================================================================================

isFav = false;
isPressed = false;

// -- =====================================================================================

@Prop() aID: number;
@Prop() myText: string;
@Prop() myType: TS.Kalameh;

// -- =====================================================================================

mounted () {
    // setTimeout(() => {
    //     let h = ( this.$refs.kalameh as any ).nativeView.getActualSize().height;
    //     console.log(h);
    // }, 1000);
}

// -- =====================================================================================

get theType (): TS.Kalameh {

    let theType = this.myType;

    let salam = [
        "عليها‌السلام",
        "عليه‌السلام",
        "صلى‌الله‌عليه‌وآله‌وسلم",
        "عليهما‌السلام",
        "(",
        ")"
    ];

    for ( const x of salam ) 
        if ( x === this.myText ) 
            theType = "salam";

    if ( this.myText === "!BREAKLINE!" ) theType = "BREAKLINE";
    if ( this.myText === "!BIG_BREAKLINE!" ) theType = "BIG_BREAKLINE";

    // .. highlight marked ayat
    this.isFav = this.myType === "number" && storage.fav_q.includes( this.aID ) ?
        true : false;

    return theType;

}

// -- =====================================================================================

touched ( args ) {

    // .. press effect
    switch ( args.action ) {

        case "down": this.isPressed = true;  break;

        case "move":
        case "up":   this.isPressed = false; break;

    }

}

// -- =====================================================================================

autoTranslate () {
    if ( this.myType === "quran" || this.myType === "hadis" ) this.lookup( this.myText );
}

// -- =====================================================================================

lookup ( text: string ): void {

    Vue.prototype.$navigateTo( Lookup, {

        frame : "base",

        backstackVisible : true,

        props : {
            word : text,
        },

        transition : {
            name         : "slideLeft",
            duration     : 300,
        }

    } );

}

// -- =====================================================================================

destroyed () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */

    .ESM {
        font-size: 140;
        width: 100%;
        font-family: Besmellah_2;
        padding: 8 2;
        margin-top: -62.9;
        height: 125.8;
        text-align: center;
    }

    .CoolGreen .ESM {
        color: #548505;
    }

    .Smoky .ESM {
        color: #548505;
    }

    .quran, .sajdeh {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
        height: 63;
    }

    .CoolGreen .quran {
        color: #e6e6e6;
    }

    .CoolGreen .sajdeh {
        color: #2b99e2;
    }

    .Smoky .sajdeh {
        color: #1a6fa8;
    }

    .salam {
        font-family: Alaem;
        padding-top: 20;
    }

    .CoolGreen .salam {
        color: #4dbae6;
    }

    .Smoky .salam {
        color: #1d80a7;
    }

    .number {
        font-family: MADDINA;
        text-align: center;
        font-size: 16;
        padding-top: 1.4;
        margin: 20 2;
        width: 23;
        height: 23;
        align-self: center;
        border-radius: 99;
        font-weight: bold;
    }

    .CoolGreen .number {
        background-color: #4dbae6;
        color: #031a1d;
    }

    .Smoky .number {
        background-color: #3a9ec5;
        color: #e6e6e6;
    }

    .CoolGreen .fav {
        background-color: #a31f87;
    }

    .Smoky .fav {
        background-color: #a31f87;
    }

    .CoolGreen .pressed {
        background-color: #333636;
    }

    .Smoky .pressed {
        background-color: #c2c2c2;
    }

    .BREAKLINE, .BIG_BREAKLINE {
        width: 100%;
        opacity: 0;
    }

    .BREAKLINE {
        height: 1;
        margin-top: -1;
    }

    .BIG_BREAKLINE {
        height: 25;
    }

</style>