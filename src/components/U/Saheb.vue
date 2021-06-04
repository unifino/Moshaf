<template>
<GridLayout class="saheb" @tap="tapped">

<!---------------------------------------------------------------------------------------->

    <GridLayout>
        <Label :text="str" textWrap="true" class="text" />
    </GridLayout>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { route }                        from '@/mixins/router'
import { asma, Quran }                  from "@/db/Q/Quran"
import { Hadith }                       from "@/db/H/Al-Hadith"
import { Najawa }                       from "@/db/N/Al-Najawa"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Saheb extends Vue {

// -- =====================================================================================

str: string = "";
id: number = -1;

// -- =====================================================================================

@Prop() source: TS.Source;

// -- =====================================================================================

mounted () {
    this.refresh();
}

// -- =====================================================================================

refresh () {
    this.id = tools.saheb( this.source as "Q"|"H" );
    if ( this.source === "H" ) this.str = tools.getHadith( this.id ).arabi;
    if ( this.source === "Q" ) this.str = Quran[ this.id ].text;
}


// -- =====================================================================================

tapped () {
    let address: TS.here = this.source === "Q" ? "Qertas" : "Base_10";
    route( address, { id: this.id } );
}

// -- =====================================================================================

destroyed () {

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .saheb {
        padding: 10 17;
        width: 240;
        height: 140;
        border-radius: 7;
        margin: 5;
    }

    .CoolGreen .saheb {
        background-color: #1a1d1d;
    }

    .Smoky .saheb {
        background-color: #2a9de0;
        background-color: #dfe2e2;
    }

    .text {
        font-family: Amiri-Regular;
        font-size: 14;
        line-height: 14;
        color: #243333;
    }

</style>