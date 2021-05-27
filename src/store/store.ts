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
        foundData       : []                    ,
        foundDataSlot   : null                  ,
                                                 
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
        foundData       : TS.FoundContent []    ,
        foundDataSlot   : "M1"|"M2"|"M3"|"M4"   ,
                                                 
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
