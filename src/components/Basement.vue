<template>
<!-- <AbsoluteLayout class="fx" ref="root" @swipe="swipeControl"> -->
<AbsoluteLayout class="fx" ref="root" @doubleTap="backOne">
<!---------------------------------------------------------------------------------------->

    <Frame class="fx" id="_base_" ref="_base_" >
        <Welcome />
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
import { route }                        from '@/mixins/router'
import Welcome                          from "@/components/Welcome.vue"
import * as Cloud                       from "@/mixins/cloud"

// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
// * npm i nativescript-exit
import { exit }                         from "nativescript-exit";
import { Hadith }                       from "@/db/H/Al-Hadith"
import { asma, Quran }                  from "@/../../db/Q/Quran"

// -- =====================================================================================

@Component ( {
    components: { Welcome }
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

init (): void {

    // .. checking existence && structure of mandatory files
    storage.db_check().then( () => this.setup() )
    // .. not resolvable situation
    .catch( msg => tools.toaster( msg + "" ) );

}

// -- =====================================================================================

setup (): Promise<void> {

    return new Promise ( async (rs, rx) => {

        // .. init DBs
        await this.db_init();

        // .. get cloud => re-calculation
        Cloud.sync( "down" )
        .then( () => storage.re_calculation() )
        .catch( e => console.log(e) );

        // .. just applying default theme
        TM.themeApplier( "Black", this );

        // .. first actual step! bring-up the Unity
        this.to_Unity( true );

        // .. basic steps has been resolved!
        rs();

    } )

}

// -- =====================================================================================

async db_init() {

    for ( let q of Quran ) {
        q.simpleInFarsiLetters = tools.inFarsiLetters( q.simple );
    }

    Hadith.forEach ( h => h.aF = tools.inFarsiLetters( h.a ) );
    Hadith.forEach ( h => h.bF = tools.inFarsiLetters( h.b ) );

}

// -- =====================================================================================

backButtonCtl ( e: NS.AndroidActivityEventData|any ) {

    // .. somewhere else controls this actions
    if ( e.cancel ) return 0;

    // todo .. page stack could be defined!

    // .. prevent more actions by default
    e.cancel = true;

    switch ( store.state.here ) {

        case "Welcome": exit(); break;

        case "Unity":
            if ( store.state.routeStack.length > 1 ) e.cancel = false;
            else {
                // .. Go to Page
                route( "Welcome" );
                // .. do we need an upload?
                if ( store.state.earth.length ) {
                    // .. notify
                    tools.toaster( "SYNCING ..." );
                    // .. syncing ...
                    Cloud.sync( "up" )
                    .then( () => storage.re_calculation() )
                    .catch( e => console.log(e) );
                }
            }
            break;

        case "Base_00": e.cancel = false; break;
        case "Base_01": e.cancel = false; break;
        case "Base_10": e.cancel = false; break;
        // case "Paper"  : e.cancel = store.state.iPanel_ON; break;

        // .. let do more actions
        default: e.cancel = false; break;

    }

    // .. reduce pageStack
    if ( !e.cancel )
        if ( store.state.routeStack.length > 1 ) 
            store.state.routeStack.pop();

}

// -- =====================================================================================

to_Unity ( init = false ): void {
    route( "Unity", null, init );
}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    if ( store.state.here !== "Unity" ) {
        if ( args.direction === NS.SwipeDirection.right ) this.to_Unity();
        if ( args.direction === NS.SwipeDirection.left  ) this.to_Unity();
    }

}

// -- =====================================================================================

backOne () {
    // ! it has conflict with scroll-back function
    // let frameModule = require( "ui/frame" );
    // let topmost = frameModule.topmost();
    // topmost.goBack();
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
*{
    color: #e4d60f
}
</style>