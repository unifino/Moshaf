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
        activeAyah      : -1                    ,
                                                 
        phraseInSearch  : null                  ,
        forceSearchFuse : false                 ,
        lastSearchedBy  : null                  ,
        foundData_M1    : []                    ,
        foundData_M2    : []                    ,
        foundData_M3    : []                    ,
                                                 
        fav             : {                      
            Q           : []                    ,
            H           : []                    ,
        }                                       ,
        memo            : {                      
            Q           : []                    ,
            H           : []                    ,
        }                                       ,
                                                 
        cakeBound       : {}                    ,
                                                 
    } as state,

} ) ;

// -- =====================================================================================

interface state {
                                                 
        appConfig       : appConfig             ,
                                                 
        here            : TS.here               ,
        activeAyah      : number                ,
                                                 
        phraseInSearch  : string                ,
        forceSearchFuse : boolean               ,
        lastSearchedBy  : TS.SearchMode         ,
        foundData_M1    : TS.FoundContent []    ,
        foundData_M2    : TS.FoundContent []    ,
        foundData_M3    : TS.FoundContent []    ,
                                                 
        fav             : {                      
            Q           : number[]              ,
            H           : number[]              ,
        }                                       ,
        memo            : {                      
            Q           : number[]              ,
            H           : number[]              ,
        }                                       ,
        cakeBound       : TS.CakeBound          ,
                                                 
}

interface appConfig {
                                                 
            theme       : TS.ThemeName          ,
            darkMode    : boolean               ,
                                                 
}

// -- =====================================================================================
