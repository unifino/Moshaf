<template>
<!---------------------------------------------------------------------------------------->

    <Label ref="kalameh" :text="myText" :class="myType" @tap="copy" />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"

// -- =====================================================================================

@Component ( {
    components: {}
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
    .fx {
        height: 100%;
        width: 100%;
    }

    .string {
        color: #888888;
        text-align: center;
        font-size: 19;
        line-height: 7;
        padding: 8 2;
        border-radius: 5;
        border-color: #23ffffff;
        border-width: 0;

        /* font-family: noorehira; */
        /* font-family: Al Qalam Quran Majeed 2; */
        /* font-family: Al Qalam Quran Majeed 1; */
        /* font-family: Al Qalam Quran Majeed; */
        /* font-family: Al Qalam Quran; */
        /* font-family: AlQalamQuran; */

        /* font-family: QUR_STD;
        font-family: ar-Othmani;
        font-family: ar-Quran1;
        font-family: MADDINA;
        font-family: ScheherazadeRegOT;
        font-family: Scheherazade-Regular;
        font-family: JF Flat; */
        font-family: Amiri-Regular;
    }

    .number {
        text-align: center;
        font-size: 14;
        padding-top: 1.7;
        margin: 4;
        width: 23;
        height: 23;
        align-self: center;
        border-radius: 99;
        background-color: #141414;
        color: #a7a7a7;
        font-family: MADDINA;
    }

    .pressed {
        font-weight: bold;
        color: #000000;
        border-color: #929497;
    }

</style>