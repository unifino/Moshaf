import { Vue, Component, Prop }         from "vue-property-decorator"
import * as NS                          from "@nativescript/core"
import * as TS                          from "@/../types/myTypes"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

import Welcome                          from "@/components/Welcome.vue"
import Base_00                          from "@/components/00/_00.vue"
import Paper                          from "@/components/10/Paper.vue"
import Base_01                          from "@/components/01/_01.vue"
import Qertas                           from "@/components/00/Qertas.vue"
import Najwa                            from "@/components/01/Najwa.vue"
import Lookup                           from "@/components/W/Lookup.vue"
import Unity                            from "@/components/U/Unity.vue"

// -- =====================================================================================

declare module "vue-property-decorator" {
    interface Vue {
        $navigateTo( args );
    }
}

// -- =====================================================================================

export function route ( address: TS.here, props?: {}, init?: boolean ) {

    // .. register pageStack
    let stack = store.state.routeStack;
    stack.push( address );
    if ( stack.length > 5 ) stack.shift();

    let paths: TS.Path = {

        Welcome: { page: Welcome, duration: 300, transition: "flipLeft",    },
        Base_00: { page: Base_00, duration: 300, transition: "flipLeft",    },
        Base_01: { page: Base_01, duration: 300, transition: "flipLeft",    },
        Paper:   { page: Paper,   duration: 300, transition: "flipLeft",    },
        Qertas:  { page: Qertas , duration: 300, transition: "slideTop",    },
        Najwa:   { page: Najwa  , duration: 300, transition: "slideTop",    },
        Lookup:  { page: Lookup , duration: 300, transition: "slideRight",  }, 

        Unity:   { 
            page: Unity , 
            transition: init ? "fade" : "flipRight",
            duration: init ? 500 : 300
        },

    };

    let myPath = paths[ address ];

    Vue.prototype.$navigateTo( myPath.page, {

        frame: '_base_',
        props: props,
        backstackVisible: true,
        transition: { name: myPath.transition, duration: 300 } 

    } );

    store.state.here = address;

}

// -- =====================================================================================
