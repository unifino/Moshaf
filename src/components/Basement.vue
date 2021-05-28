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

import Base_00                          from "@/components/00/_00.vue"
import IntuitivePanel                   from "@/components/m/Intuitive/iPanel.vue"
import Qertas                           from "@/components/00/Qertas.vue"
import Base_10                          from "@/components/10/_10.vue"
import Base_01                          from "@/components/01/_01.vue"
// * npm i nativescript-permissions
import permissions                      from "nativescript-permissions"
// * npm i nativescript-exit
import { exit }                         from "nativescript-exit";
import SearchBox                        from "@/components/m/SearchBox/Search_Panel.vue"

// -- =====================================================================================

import VueDevtools                      from 'nativescript-vue-devtools'
if( TNS_ENV !== 'production' ) { 
    Vue.use( VueDevtools ); 
    console.log = function ( ...data: any[] ) {
        const unwanted: any[] = [
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> AppendChild(",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> CreateElement",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> CreateComment()",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> ParentNode(",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> InsertBefore(",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> RemoveChild(",
            "{NSVue (Vue: 2.6.12 | NSVue: 2.9.0)} -> NextSibling("
        ];
        let permission = true;
        for ( let x of unwanted ) 
            if ( typeof data[0] === "string" && data[0].includes(x) ) 
                permission = false;
        if ( permission ) console.info(data);
    }; 
}
Vue.config.silent = ( TNS_ENV === 'production' );

// -- =====================================================================================

@Component ( {
    components: {}
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

backButtonCtl ( e: NS.AndroidActivityEventData|any ) {

    // .. prevent more actions by default
    e.cancel = true;

    let _base_ = this.$root.$children[0].$refs._base_ as any;

    switch ( store.state.here ) {

        case "Base_00":
            // .. get elements(s)
            let base_00 = _base_.$children[1] as Base_00;
            let searchBox = base_00.$refs[ "search" ] as SearchBox;
            // ..  just clear search
            if ( store.state.foundData.length ) tools.searchBoxResetter();
            // .. exit
            else exit();
        break;

        case "Qertas":
            // .. get elements(s)
            let qertas = _base_.$children[2] as Qertas;
            let intuitivePanel = qertas.$refs[ "IntuitivePanel" ] as IntuitivePanel;
            // ..  just close IntuitivePanel by resetting activeAyah
            if ( intuitivePanel.active ) store.state.activeAyah = -1;
            else qertas.exit();
        break;

        // .. let do NOTHING!
        case "Basement": e.cancel = true;  break;

        // .. let do more actions
        default: e.cancel = false; break;

    }

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

        // .. first actual step! go to the Quran
        this.to_Base_00( null );

        // .. basic steps has been resolved!
        rs();

    } )

}

// -- =====================================================================================

to_Base_00 ( direction: NS.SwipeDirection|null ): void {

    let dir: string;

    switch ( direction ) {
        case NS.SwipeDirection.left : dir = "slideLeft";    break;
        case NS.SwipeDirection.right: dir = "slideRight";   break;
        case NS.SwipeDirection.down : dir = "slideDown";    break;
        case NS.SwipeDirection.up   : dir = "slideUp";      break;
        default                     : dir = "fade";         break;
    }

    Vue.prototype.$navigateTo( Base_00, {

        frame : '_base_',
        backstackVisible : true,
        transition : { name: dir, duration: direction ? 300 : 550 }

    } );

    tools.searchBoxResetter();
    store.state.search_IN = "Q";

}

// -- =====================================================================================

to_Base_10 (): void {

    tools.searchBoxResetter();

    Vue.prototype.$navigateTo( Base_10, {

        frame : "_base_" ,
        backstackVisible : true,
        transition : { name: "slideRight", duration: 300 } 

    } );

    store.state.search_IN = "H";

}

// -- =====================================================================================

to_Base_01 (): void {

    tools.searchBoxResetter();

    Vue.prototype.$navigateTo( Base_01, {

        frame : "_base_" ,
        backstackVisible : true,
        transition : { name: "slideLeft", duration: 300 }

    } );

    store.state.search_IN = "N";

}

// -- =====================================================================================

swipeControl ( args: NS.SwipeGestureEventData ) {

    if ( store.state.here === "Base_00" ) {
        if ( args.direction === NS.SwipeDirection.right ) this.to_Base_10();
        if ( args.direction === NS.SwipeDirection.left ) this.to_Base_01();
    }

    else if
    (
        ( store.state.here === "Base_01" && args.direction === NS.SwipeDirection.right ) ||
        ( store.state.here === "Base_10" && args.direction === NS.SwipeDirection.left )
    )
    {
        tools.searchBoxResetter();
        let _base_ = this.$root.$children[0].$refs._base_ as any;
        let base_00 = _base_.$children[1] as any;
        base_00.$navigateBack();
        store.state.search_IN = "Q";
    }

    // .. theme changer
    if ( args.direction === NS.SwipeDirection.down ) TM.themeApplier( "CoolGreen", this );
    if ( args.direction === NS.SwipeDirection.up ) TM.themeApplier( "Smoky", this );


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