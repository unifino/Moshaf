<template>
<GridLayout
    :class="myClass"
    @tap="$emit( 'tap' )"
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

export default class myButton extends Vue {

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

/* ------------------------------------------- */

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
        border-radius: 12;
    }

    .Smoky .toolButton {
        color:#cfe9f0;
        border-color: #9dd0d4;
        background-color: #1a848b;
    }

    .CoolGreen .toolButton {
        color:#919a9c;
        border-color: #2b5b7a;
        background-color: #072429;
    }

</style>




