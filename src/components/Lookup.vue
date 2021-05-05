<template>
<Page>
<GridLayout class="fehrest" rows="44,*,44">

<!---------------------------------------------------------------------------------------->

    <ScrollView 
        row=1
        class="ghertas"
        orientation="vertical"
        verticalAlignment="middle"
        scrollBarIndicatorVisible="false"
    >

        <Label class="text" :text="data" textWrap=true />

    </ScrollView>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</Page>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import store                            from "@/store/store"
import * as NS                          from "@nativescript/core"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Fehrest extends Vue {

// -- =====================================================================================

@Prop() word: string;

// -- =====================================================================================

data = "";

// -- =====================================================================================

mounted () {
    this.translate( this.word );
}

// -- =====================================================================================

translate ( word: string ) {

    const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0";

    const url = "https://www.almaany.com/ar/dict/ar-ar/";
    NS.Http.request( {
        url: url + word ,
        method: "GET",
        headers: { "User-Agent": userAgent }
    } )
    .then(
        res => this.data = this.textExtractor( res.content.toString() ),
        e => {}
    )
    .catch( e => {} );

}

// -- =====================================================================================

textExtractor ( text: string ) {

    // .. pick first part
    // .. beginning
    let cut_A = '<ol class="meaning-results">';
    let cut_A_idx = text.indexOf( cut_A );
    // .. cut it
    text = text.substring( cut_A_idx );
    // .. end
    let cut_B = '</ol>';
    let cut_B_idx = text.indexOf( cut_B );
    // .. cut it
    text = text.substring( 0, cut_B_idx );
    // .. remove ads
    const rgx = /<div.*>(.|\n)*?<\/div>/g;
    text = text.replace( rgx, "" );

    // .. trim
    text = text.replace( /<style([\s\S]*?)<\/style>/gi, '' );
    text = text.replace( /<script([\s\S]*?)<\/script>/gi, '' );
    text = text.replace( /<\/div>/ig, '\n' );
    text = text.replace( /<\/li>/ig, '\n' );
    text = text.replace( /<li>/ig, '' );
    text = text.replace( /<\/ul>/ig, '\n' );
    text = text.replace( /<\/p>/ig, '\n' );
    text = text.replace( /<br\s*[\/]?>/gi, '\n' );
    text = text.replace( /<[^>]+>/ig, '' );
    text = text.replace( /\n\n+/ig, '\n\n' );

    return text;

}

// -- =====================================================================================

destroyed () {
    // ! caution
    store.state.here = "Ghertas";
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .text {
        color: #888a8a;
        font-family: Homa;
        width: 80%;
        font-size: 14.4;
    }

</style>