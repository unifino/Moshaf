<template>
<AbsoluteLayout
    class="fx"
    ref="root"
    @swipe="swipeControl"
>

<!---------------------------------------------------------------------------------------->

    <Frame class="fx" id="_base_" ref="_base_" >
        <Page>
            <GridLayout>
                <Image src="res://moshaf" width=165 stretch="aspectFit" />
            </GridLayout>
        </Page>
    </Frame>

<!---------------------------------------------------------------------------------------->

</AbsoluteLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

import Unity                            from "@/components/U/Unity.vue"
// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
// * npm i nativescript-exit
import { exit }                         from "nativescript-exit";
import { Hadith }                       from "@/db/H/Al-Hadith"
import { asma, Quran }                  from "@/db/Q/Quran"

// -- =====================================================================================

@Component ( {
    components: { Unity }
} )

// -- =====================================================================================

export default class Base extends Vue {

// -- =====================================================================================

moshaf = "";

// -- =====================================================================================

mounted () {

    this.init();

    Hadith.forEach ( h => h.aF = tools.inFarsiLetters( h.a ) );
    Hadith.forEach ( h => h.bF = tools.inFarsiLetters( h.b ) );
    Quran.forEach ( q => q.simpleInFarsiLetters = tools.inFarsiLetters( q.simple ) );

    // .. back Button Ctl
    NS.Application.android.on( 
        NS.AndroidApplication.activityBackPressedEvent, 
        e => this.backButtonCtl(e),
    );

    // store.watch(
    //     state => state.here, 
    //     (newVal, oldVal) => 
    //         console.log( "\tFrom:\t" +oldVal +"     \tTo:\t" +newVal +"     \t" ) 
    // );

    // .. initial Here Statement
    store.state.here = "Basement";

}

// -- =====================================================================================

init (): void {

    // .. after granting storage permission further steps should be taken
    this.permissionApplier()
    // .. checking existence && structure of mandatory files
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
            "android.permission.WRITE_EXTERNAL_STORAGE" ,

        ] )
        .then ( () => rs( "Access has been granted!" ) )
        .catch( () => rx( "No Access to Storage!") );

    } );

}

// -- =====================================================================================

setup (): Promise<void> {

    return new Promise ( (rs, rx) => { 

        // .. just applying default theme
        TM.themeApplier( "Smoky", this );

        // .. first actual step! bring-up the Unity
        this.to_Unity();

        // .. basic steps has been resolved!
        rs();

    } )

}

// -- =====================================================================================

backButtonCtl ( e: NS.AndroidActivityEventData|any ) {

    // .. prevent more actions by default
    e.cancel = true;

    switch ( store.state.here ) {

        // .. let do NOTHING!
        case "Basement": e.cancel = true;  break;

        // .. exit
        case "Unity": exit(); break;

        case "Base_00": if ( !store.state.foundData.length ) e.cancel = false; break;
        case "Base_01": if ( !store.state.foundData.length ) e.cancel = false; break;
        case "Base_10": if ( !store.state.foundData.length ) e.cancel = false; break;

        case "Qertas":
            if ( !~store.state.activeAyah ) e.cancel = false;
            else store.state.activeAyah = -1;
        break;

        // .. let do more actions
        default: e.cancel = false; break;

    }

    tools.searchBoxResetter();


}

// -- =====================================================================================

to_Unity ( direct = false ): void {

    Vue.prototype.$navigateTo( Unity, {
        frame : "_base_" ,
        backstackVisible : true,
        transition : { name: direct ? "flipLeft" : "fade", duration: 500 } 
    } );

    if ( !direct ) store.state.here='Unity';

}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    if ( args.direction === NS.SwipeDirection.down ) this.to_Unity( true );
    if ( args.direction === NS.SwipeDirection.up ) this.to_Unity( true );

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

/* ------------------------------------------- */

</style>