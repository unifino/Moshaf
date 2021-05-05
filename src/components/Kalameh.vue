<template>
<!---------------------------------------------------------------------------------------->

    <Label ref="kalameh" :text="myText" :class="myType" @tap="copy" />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================
declare var android; // required if tns-platform-declarations is not installed

import { Vue, Component, Prop }         from "vue-property-decorator"
// * tns plugin add nativescript-clipboard
import { setText }                      from "nativescript-clipboard"
import * as NS                          from "@nativescript/core"

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

    this.test();

}

test () {
const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0";

    NS.Http.request( {
            url: "https://www.almaany.com/ar/dict/ar-ar/" + this.myText ,
            method: "GET",
            headers: { "User-Agent": userAgent }
        } )
        .then(
            res => {

                let x = res.content;


const exStorage = android.os.Environment.getExternalStorageDirectory();
const SDCard: string = exStorage.getAbsolutePath().toString();
const myFolder  = NS.Folder.fromPath( NS.path.join( SDCard, "Moshaf" ) );
let bp = myFolder.path;
let traceFile = NS.File.fromPath ( NS.path.join( bp, "test.html"  ) );
traceFile.writeText( x.toString() );

            },
            e => console.log(e)
            
        )
        .catch( e => console.log(e)         );

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