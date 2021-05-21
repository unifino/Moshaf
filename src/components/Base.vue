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
import Fehrest                          from "@/components/00/_00.vue"
import Ghertas                          from "@/components/00/Ghertas.vue"
import Hadis                            from "@/components/10/_10.vue"
import Adeiyeh                          from "@/components/01/_01.vue"
// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
import * as tools                       from "@/mixins/tools"
import * as storage                     from "@/mixins/storage"
// * npm i nativescript-exit
import { exit }                         from "nativescript-exit";

// import VueDevtools                      from 'nativescript-vue-devtools'
// if( TNS_ENV !== 'production' ) { Vue.use( VueDevtools ) }
// Vue.config.silent = (TNS_ENV === 'production')

// -- =====================================================================================

@Component ( {
    components: { Fehrest, Ghertas, Hadis, Adeiyeh }
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

            let base = this.$root.$children[0].$refs.base as any;
            let fehrest = base.$children[1] as Fehrest;
            // ..  just clear search
            if ( fehrest.phrase ) fehrest.dismiss(true);
            // .. exit
            else exit();

            e.cancel = true;

        break;

    }

}

// -- =====================================================================================

init (): void {

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

            // .. just applying default theme
            TM.themeApplier( "Smoky", this.$refs );

            this.toFehrest( null );
            // this.toHadis();

            // .. basic steps has been resolved!
            rs();

            await new Promise( _ => setTimeout( _, 100 ) );

        } )

    } )

}

// -- =====================================================================================

toFehrest ( direction: NS.SwipeDirection|null ): void {

    let dir = direction === NS.SwipeDirection.left ? "slideLeft" : "slideRight";

    Vue.prototype.$navigateTo( Fehrest, {
        frame : 'base',
        backstackVisible : true,
        transition : {
            name         : dir,
            duration     : direction ? 300 : 1,
        } 
    } );

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

}

// -- =====================================================================================

toAdeiyeh (): void {

    Vue.prototype.$navigateTo( Adeiyeh, {
        frame : 'base' ,
        backstackVisible : true ,
        transition : {
            name         : "slideLeft",
            duration     : 300,
        } 
    } );

}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    if ( store.state.here === "Fehrest" ) {
        if ( args.direction === NS.SwipeDirection.right ) this.toHadis();
        if ( args.direction === NS.SwipeDirection.left ) this.toAdeiyeh();
    }

    else if ( store.state.here === "Hadis" && args.direction === NS.SwipeDirection.left )
        this.toFehrest( args.direction );

    else if ( store.state.here === "Adeiyeh" && args.direction === NS.SwipeDirection.right )
        this.toFehrest( args.direction );

    // .. theme changer
    if ( args.direction === NS.SwipeDirection.down )
        TM.themeApplier( "CoolGreen", this.$refs );
    if ( args.direction === NS.SwipeDirection.up )
        TM.themeApplier( "Smoky", this.$refs );


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