import Vue                              from 'vue'
import Vuex                             from 'vuex'
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

Vue.use(Vuex);
export default new Vuex.Store( {

    state: {

        darkMode    : true      ,
        here        : "Base"    ,
        activeAyah  : -1        ,

    } as state,

} ) ;

// -- =====================================================================================

export interface state {

        darkMode    : boolean   ,
        here        : TS.here   ,
        activeAyah  : number    ,

}

// -- =====================================================================================
