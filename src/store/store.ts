import Vue                              from 'vue'
import Vuex                             from 'vuex'
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

Vue.use(Vuex);
export default new Vuex.Store( {

    state: {
                                     
        here        : null          ,
        activeAyah  : -1            ,
        appConfig   : {              
            theme   : "Smoky"       ,
            darkMode: false         ,
        }                           ,
                                     
    } as state,

} ) ;

// -- =====================================================================================

export interface state {
                                     
        here        : TS.here       ,
        activeAyah  : number        ,
        appConfig   : {              
            theme   : TS.ThemeName  ,
            darkMode: boolean       ,
        }                            
                                     
}

// -- =====================================================================================
