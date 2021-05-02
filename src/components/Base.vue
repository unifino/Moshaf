<template>
<AbsoluteLayout class="fx" ref="root">

<!---------------------------------------------------------------------------------------->

    <Ghertas ref="ghertas" />

<!---------------------------------------------------------------------------------------->

</AbsoluteLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"
import store                            from "@/store/store"
import Ghertas                          from "@/components/Ghertas.vue"
// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
import * as tools                       from "@/mixins/tools"
import * as storage                     from "@/mixins/storage"
// import Bus                              from "@/mixins/bus"

// -- =====================================================================================

@Component ( {
    components: { Ghertas }
} )

// -- =====================================================================================

export default class Base extends Vue {

// -- =====================================================================================

moshaf = "";

// -- =====================================================================================

mounted () {

    this.init();

    // // .. back Button Ctl
    // NS.Application.android.on( 
    //     NS.AndroidApplication.activityBackPressedEvent, 
    //     e => this.backButtonCtl(e),
    // );

    // // .. resume Ctl
    // NS.Application.android.on( 
    //     NS.AndroidApplication.activityResumedEvent, 
    //     () => this.resumeCtl(),
    // );

    // Bus.$on( "Base_SwipeControl", this.swipeControl );
    // Bus.$on( "Base_HeadToIPanel", this.headToIPanel );

}

// -- =====================================================================================

// backButtonCtl (e) {

    // switch ( store.state.here ) {

    //     case "Salon_F"          : Bus.$emit( "Salon_F_Exit" );              break;
    //     case "ClassRoom"        : Bus.$emit( "ClassRoom_BackOrExit" );      break;
    //     case "ClassRoomEntrance": Bus.$emit( "ClassRoomEntrance_Back" );    break;
    //     case "Institute"        : Bus.$emit( "Institute_BackOrExit" );      break;

    // }

    // e.cancel = true;
    // // .. Entrance | ClassRoomEntrance | ClassRoom_B will | IPanel    be effected!

// }

// -- =====================================================================================

// resumeCtl () {

    // switch ( store.state.here ) {

    //     case "ClassRoom":
    //         tnsPLY.stop();
    //         store.state.mode = "reading";
    //         break;

    //     case "Institute":
    //         Bus.$emit( "BeautyBG_Next" );
    //         break;

    //     // .. Entrance | ClassRoom_B | ClassRoomEntrance | Salon_F will be omitted!

    // }

// }

// -- =====================================================================================

init (): void {

    // .. just applying default theme
    TM.themeApplier( "DarkGreen", this.$refs );

    // .. after granting storage permission further steps should be taken
    this.permissionApplier()
    .then( () => storage.db_check() )
    .then( () => this.setup() )
    // .. Ghertas
    .then( () => ( this.$refs.ghertas as Ghertas ).init() )
    // .then( () => Bus.$emit( "Battery_Init" ) )
    // .then( () => myPurchasedItems() )
    // .. not resolvable situation
    .catch( msg => {

        msg = msg + "";
        if ( msg.includes( "java.net.UnknownHostException: Unable to resolve host") ) 
            msg = "Check your Internet Connection!"; 

        tools.toaster( msg );

    } );


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
        .then( async db => { 

            // .. register appConfig
            // store.state.appConfig = validAppConfig;

            // .. assign user selected theme
            // TM.themeApplier( store.state.appConfig.theme, this.$refs );

            await new Promise( _ => setTimeout( _, 100 ) );

            // .. basic steps has been resolved!
            rs();

            await new Promise( _ => setTimeout( _, 100 ) );

            // .. retrieve Lessons
            // setTimeout( () => storage.putLessonsInBox(), 0 );

            await new Promise( _ => setTimeout( _, 100 ) );

            // // .. setUp app
            // this.getRootWindowSize()
            // .then( () => ( this.$refs.menu as Menu ).toggleMenu()        )
            // .then( () => this.headToInstitute( tools.instituteTravel() ) )
            // .then( () => Bus.$emit( "Welcome_Slide", false )             )
            // .then( () => ( this.$refs.scope as Scope ).init()            );

        } )

    } )

}

// -- =====================================================================================


// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    // if ( store.state.mode === "setting" ) return 0;

    // let ins = store.state.inHand.institute,
    //     actives = store.state.appConfig.activeInstitutes;

    // if ( actives.length === 1 && actives[0] === store.state.inHand.institute ) return 0;

    // if ( store.state.here === "Institute" ) {

    //     switch ( args.direction ) {

    //         case NS.SwipeDirection.right:
    //         case NS.SwipeDirection.left: 
    //             if ( store.state.mode === "shopping" ) shopping.backOrExitShop( ins );
    //             this.headToInstitute( tools.instituteTravel( args.direction ) ); 
    //             break;

    //     }

    // }

}

// -- =====================================================================================

getRootWindowSize (): Promise<void> {

    return new Promise ( rs => {

    //     let root = this.$refs.root as any;
    //     if ( !store.state.windowSize ) store.state.windowSize = {} as any;

    //     store.state.windowSize.height = root.nativeView.getActualSize().height | 0;
    //     store.state.windowSize.width = root.nativeView.getActualSize().width | 0;

    //     if ( !store.state.windowSize.width || !store.state.windowSize.height ) {
    //         setTimeout ( () => rs( this.getRootWindowSize() ) , 10 );
    //     }

    //     else return rs();

    } );

}

// -- =====================================================================================

updated () {
    // .. getting and registering root Size
    // this.getRootWindowSize();
}

// -- =====================================================================================

destroyed () {
    NS.Application.android.off( NS.AndroidApplication.activityBackPressedEvent );
    NS.Application.android.off( NS.AndroidApplication.activityPausedEvent );
    NS.Application.android.off( NS.AndroidApplication.activityResumedEvent );
    // Bus.$off( "Base_SwipeControl" );
    // Bus.$off( "Base_HeadToIPanel" );
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/*                                          */

</style>