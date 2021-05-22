<template>
<GridLayout
    :class="myClass"
    @tap="$emit( 'tap' ); $store.state.activeAyah = -1;"
    @touch="buttonTouched"
    ref="button"
>

<!---------------------------------------------------------------------------------------->

    <GridLayout rows="*,auto,*"  >
        <Label row=1 :text="' ' + myLabel + ' '" />
    </GridLayout>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"

// -- =====================================================================================

@Component

// -- =====================================================================================

export default class nButton extends Vue {

// -- =====================================================================================

@Prop() myLabel: string;
@Prop() myClass: string;

// -- =====================================================================================

press_TO: NodeJS.Timeout | any;
buttonTouched ( args ) {

    switch ( args.action ) {

        case "down":
            args.object.className = this.myClass + " pressed"; 
            break;

        case "up":
        case "cancel":
            args.object.className = this.myClass; 
            break;

    }

}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */

    .center {
        text-align: center;
    }

    .toolButton {
        text-align: center;
        font-size: 23px;
        width: 50;
        height: 50;
        margin: 3;
        border-width: 1;
        border-radius: 14;
    }

    .Smoky .toolButton {
        color:#cfe9f0;
        border-color: #1f4a52;
        background-color: #1a848b;
    }

    .CoolGreen .toolButton {
        color:#cfe9f0;
        border-color: #2b5b7a;
        background-color: transparent;
    }

</style>




