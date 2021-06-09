<template>

<!---------------------------------------------------------------------------------------->

    <Label
        :class="'fas button ' + myClass" 
        :text="String.fromCharCode( '0x' + 'f2f1' )"
        @tap="exchange( false )"
        @longPress="exchange( true )"
    />

<!---------------------------------------------------------------------------------------->

</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import SearchPanel                      from "@/components/X/Search/Search_Panel.vue";

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Exchange extends Vue {

// -- =====================================================================================

@Prop() exchangeButton: boolean;

// -- =====================================================================================

myClass = "";
SearchPanel: SearchPanel = this.$parent as any; 

// -- =====================================================================================

mounted () {
    // .. init
    this.activeClass();
}

// -- =====================================================================================

activeClass () {
    this.myClass = this.exchangeButton ? 'activate' : 'deactivate';
}

// -- =====================================================================================

exchange ( rev: boolean ) {

    switch ( this.SearchPanel.activeMode ) {

        case "Q": this.SearchPanel.activeMode = rev ? "H" : "H"; break;
        case "H": this.SearchPanel.activeMode = rev ? "Q" : "Q"; break;
        case "T": this.SearchPanel.activeMode = rev ? "H" : "Q"; break;

        // case "Q": this.SearchPanel.activeMode = rev ? "T" : "H"; break;
        // case "H": this.SearchPanel.activeMode = rev ? "Q" : "T"; break;
        // case "T": this.SearchPanel.activeMode = rev ? "H" : "Q"; break;

        // case "Q": this.SearchPanel.activeMode = rev ? "T" : "H"; break;
        // case "H": this.SearchPanel.activeMode = rev ? "Q" : "N"; break;
        // case "N": this.SearchPanel.activeMode = rev ? "H" : "T"; break;
        // case "T": this.SearchPanel.activeMode = rev ? "N" : "Q"; break;

    }

    console.log();
    

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .deactivate {
        visibility: collapse;
    }

</style>