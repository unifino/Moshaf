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

// -- =====================================================================================

@Component ( {
    components: { Lookup }
} )

// -- =====================================================================================

export default class Kalameh extends Vue {

// -- =====================================================================================

@Prop() myText: string;
@Prop() myType: "string"|"number";

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

init (): void {}

// -- =====================================================================================

lookup (): void {

    Vue.prototype.$navigateTo( Lookup, {

        frame : "base",

        backstackVisible : true,

        props : {
            word : this.myText,
        } , 

        transition : {
            name         : "slideLeft",
            duration     : 300,
        } 

    } );

    store.state.here = "Lookup";

}

// -- =====================================================================================

copy ( args ) {

    // .. press effect
    args.object.className += " pressed";
    setTimeout( () => args.object.className = this.myType, 100 );

    setText( this.myText );

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
        color: #548505;
        width: 100%;
        font-family: Besmellah_2;
        line-height: 7;
        padding: 8 2;
        margin-top: -50;
        text-align: center;
    }

    .string, .sajdeh {
        font-family: Amiri-Regular;
        color: #888888;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 8 2;
        border-radius: 5;
        border-color: #23ffffff;
        border-width: 0;
    }

    .sajdeh {
        color: #2b99e2;
    }

    .number {
        font-family: MADDINA;
        text-align: center;
        font-size: 14;
        padding-top: 1.7;
        margin: 0 2;
        width: 23;
        height: 23;
        align-self: center;
        border-radius: 99;
        background-color: #141414;
        color: #a7a7a7;
    }

    .pressed {
        font-weight: bold;
        color: #000000;
        border-color: #929497;
    }

</style>