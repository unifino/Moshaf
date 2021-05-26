<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f292' )"
        @tap="listRetriever()"
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

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class HashTag extends Vue {

// -- =====================================================================================

@Prop() hashTagButton: boolean;

// -- =====================================================================================

myClass = "";

// -- =====================================================================================

mounted () {
    // .. init
    this.activeClass();
}

// -- =====================================================================================

activeClass () {
    this.myClass = this.hashTagButton ? 'activate' : 'deactivate';
}

// -- =====================================================================================

listRetriever () {

    // // .. re-tap situation
    // if ( this.tagsList.length ) {
    //     this.tagsList = [];
    //     return;
    // } 

    let tagsListSimple: string[] = [],
        tmpTagsList: { tagName: string, count: number }[] = [],
        tmpID: number;

    for ( const x of store.state.bounds ) {
        if ( x[0].slice( 0, 1 ) === "T" ) tagsListSimple.push( x[0].slice(2) );
        if ( x[1].slice( 0, 1 ) === "T" ) tagsListSimple.push( x[1].slice(2) );
    }

    tmpTagsList = tagsListSimple.reduce( (soFar, nextOne) => {

        tmpID = soFar.findIndex( x => x.tagName === nextOne );
        // .. count up fot this Tag
        if ( ~tmpID ) soFar[ tmpID ].count++;
        // .. add this Tag
        else soFar.push( { tagName: nextOne, count: 1 } );

        return soFar;

    }, tmpTagsList );

    // this.tagsList = tmpTagsList.map( (x,i) => {
    //     return {
    //         text: x.tagName,
    //         count: tools.arabicDigits( x.count + "" ),
    //     }
    // } );

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */
    .deactivate {
        visibility: collapse;
    }

</style>