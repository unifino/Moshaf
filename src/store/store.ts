import Vue                              from 'vue'
import Vuex                             from 'vuex'
import * as TS                          from "@/../types/myTypes"

// -- =====================================================================================

Vue.use(Vuex);
export default new Vuex.Store( {

    state: {
                                                 
        appConfig       : {                      
            theme       : "Smoky"               ,
            darkMode    : false                 ,
        }                                       ,
                                                 
        here            : null                  ,
        search_By       : null                  ,
                                                 
        cacheBound      : []                    ,
        iPanel_ON       : false                 ,
        search_ON       : false                 ,
        search_CH       : null                  ,
                                                 
        fav             : {                      
            Q           : []                    ,
            H           : []                    ,
        }                                       ,
        memo            : {                      
            Q           : []                    ,
            H           : []                    ,
        }                                       ,
                                                 
        cakeBound       : {}                    ,
        routeStack      : []                    ,
                                                 
    } as state,

} ) ;

// -- =====================================================================================

interface state {
                                                 
        appConfig       : appConfig             ,
                                                 
        here            : TS.here               ,
        search_By       : TS.search_By          ,
                                                 
        cacheBound      : TS.RawBound           ,
        iPanel_ON       : boolean               ,
        search_ON       : boolean               ,
        search_CH       : TS.search_By          ,
                                                 
        fav             : {                      
            Q           : number[]              ,
            H           : number[]              ,
        }                                       ,
        memo            : {                      
            Q           : number[]              ,
            H           : number[]              ,
        }                                       ,
        cakeBound       : TS.CakeBound          ,
                                                 
        routeStack      : string[]              ,
                                                 
}

interface appConfig {
                                                 
            theme       : TS.ThemeName          ,
            darkMode    : boolean               ,
                                                 
}

// -- =====================================================================================
