<template>
<!---------------------------------------------------------------------------------------->

    <Label ref="kalameh" :text="myText" :class="myType" @tap="lookup" />

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

// -- =====================================================================================

@Component ( {
    components: { Lookup }
} )

// -- =====================================================================================

export default class Kalameh extends Vue {

// -- =====================================================================================

@Prop() myText: string;
@Prop() fullText: string;
@Prop() myType: "string"|"number"|"ESM"|"hadis";

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

init (): void {}

// -- =====================================================================================

lookup ( args ): void {

    // .. style and copy
    this.copy( args );

    if ( this.myType === "string" || this.myType === "hadis" ) {

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

    if ( this.myType === "hadis" ) setText( this.myText );

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
        line-height: 7;
        padding: 8 2;
        margin-top: -50;
        text-align: center;
    }

    .CoolGreen .ESM {
        color: #548505;
    }

    .string, .sajdeh {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 8 2;
        border-radius: 5;
    }

    .CoolGreen .string {
        color: #e6e6e6;
    }

    .CoolGreen .sajdeh {
        color: #2b99e2;
        /* border-color: #23ffffff; */
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
    }

    .CoolGreen .number {
        background-color: #4dbae6;
        font-weight: bold;
        color: #031a1d;
    }

    .pressed {
        font-weight: bold;
    }

    .CoolGreen .pressed {
        background-color: #072529;
        color: #a7a7a7;
    }

</style>