<template>
<!---------------------------------------------------------------------------------------->

    <Label ref="kalameh" :text="myText" :class=theType @tap="lookup" />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"
import Lookup                           from "@/components/Lookup.vue"
import store                            from "@/store/store"
import * as tools                       from "@/mixins/tools"
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

@Component ( {
    components: { Lookup }
} )

// -- =====================================================================================

export default class Kalameh extends Vue {

// -- =====================================================================================

@Prop() myText: string;
@Prop() fullText: string;
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

    return theType;

}

// -- =====================================================================================

lookup ( args ): void {

    // .. style and copy
    this.copy( args );

    if ( this.myType === "string" || this.myType.includes( "hadis" ) ) {

        Vue.prototype.$navigateTo( Lookup, {

            frame : "base",

            backstackVisible : true,

            props : {
                word : tools.erabTrimmer( this.myText ),
            },

            transition : {
                name         : "slideLeft",
                duration     : 300,
            }

        } );

    }

}

// -- =====================================================================================

copy ( args ) {

    // .. press effect
    args.object.className += " pressed";
    setTimeout( () => args.object.className = this.myType, 100 );

    if ( this.myType === "string" ) setText( tools.erabTrimmer( this.myText ) );

    if ( this.myType.includes( "hadis" ) ) setText( this.myText );

    if ( this.myType === "number" ) {
        setText( tools.erabTrimmer( this.fullText ) );
        tools.toaster( "آیه کپی شد.", "short" );
    }

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
        margin-top: -52;
        height: 140;
        text-align: center;
    }

    .CoolGreen .ESM {
        color: #548505;
    }

    .Smoky .ESM {
        color: #548505;
    }

    .string, .sajdeh {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 7 2;
        border-radius: 5;
    }

    .CoolGreen .string {
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
        margin: 0 2;
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

    .pressed {
        font-weight: bold;
    }

    .CoolGreen .pressed {
        background-color: #123b41;
        color: #a7a7a7;
    }

    .Smoky .pressed {
        background-color: #123b41;
        color: #a7a7a7;
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