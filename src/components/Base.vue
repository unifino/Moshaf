<template>
<AbsoluteLayout class="fx" ref="root" @swipe="swipeControl" >

<!---------------------------------------------------------------------------------------->

    <Frame class="fx" id="base" ref="base" ><Page/></Frame>

<!---------------------------------------------------------------------------------------->

</AbsoluteLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TM                          from "@/themes/themeManager"
import store                            from "@/store/store"
import Fehrest                          from "@/components/Fehrest.vue"
import Ghertas                          from "@/components/Ghertas.vue"
import Hadis                            from "@/components/Hadis.vue"
// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
import * as tools                       from "@/mixins/tools"
import * as storage                     from "@/mixins/storage"
// * npm i nativescript-exit
import { exit }                         from "nativescript-exit";

// -- =====================================================================================

@Component ( {
    components: { Fehrest, Ghertas, Hadis }
} )

// -- =====================================================================================

export default class Base extends Vue {

// -- =====================================================================================

moshaf = "";

// -- =====================================================================================

mounted () {

    this.init();

    // .. back Button Ctl
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => this.backButtonCtl(e),
    );

}

// -- =====================================================================================

backButtonCtl (e) {

    switch ( store.state.here ) {

        case "Fehrest":
            exit();
            e.cancel = true;
        break;

    }

}

// -- =====================================================================================

init (): void {

    // .. just applying default theme
    TM.themeApplier( "DarkGreen", this.$refs );

    // .. after granting storage permission further steps should be taken
    this.permissionApplier()
    .then( () => storage.db_check() )
    .then( () => this.setup() )
    // .. not resolvable situation
    .catch( msg => tools.toaster( msg ) );

}

// -- =====================================================================================

permissionApplier (): Promise<any> {

    return new Promise ( (rs,rx) => { 

        // .. setup the Permissions 
        permissions.requestPermission ( [

            "android.permission.INTERNET"               ,
            "android.permission.READ_EXTERNAL_STORAGE"  ,
            "android.permission.WRITE_EXTERNAL_STORAGE" 

        ] )
        .then ( () => rs( "Access has been granted!" ) )
        .catch( () => rx( "No Access to Storage!") );

    } );

}

// -- =====================================================================================

setup (): Promise<void> {

    return new Promise ( (rs, rx) => { 

        // .. checking existence && structure of mandatory files
        storage.db_check()
        .then( async () => { 

            // .. register appConfig
            // store.state.appConfig = validAppConfig;

            // .. assign user selected theme
            // TM.themeApplier( store.state.appConfig.theme, this.$refs );

            // this.toFehrest();
            this.toHadis();

            // .. basic steps has been resolved!
            rs();

            await new Promise( _ => setTimeout( _, 100 ) );

        } )

    } )

}

// -- =====================================================================================

toFehrest (): void {

    Vue.prototype.$navigateTo( Fehrest, {
        frame : 'base',
        backstackVisible : true,
        transition : {
            name         : "slideLeft",
            duration     : 300,
        } 
    } );

    store.state.here = "Fehrest";

}

// -- =====================================================================================

toHadis (): void {

    Vue.prototype.$navigateTo( Hadis, {
        frame : 'base' ,
        backstackVisible : true ,
        transition : {
            name         : "slideRight",
            duration     : 300,
        } 
    } );

    store.state.here = "Hadis";

}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    if ( store.state.here === "Fehrest" && args.direction === NS.SwipeDirection.right ) 
        this.toHadis();

    if ( store.state.here === "Hadis" && args.direction === NS.SwipeDirection.left ) 
        this.toFehrest();

}

// -- =====================================================================================

destroyed () {
    NS.Application.android.off( NS.AndroidApplication.activityBackPressedEvent );
    NS.Application.android.off( NS.AndroidApplication.activityPausedEvent );
    NS.Application.android.off( NS.AndroidApplication.activityResumedEvent );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */

</style>