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
        activeHadith   : []                    ,
        search_By       : null                  ,
        search_IN       : "Q"                   ,
                                                 
        fraseInSearch   : null                  ,
        searched_By     : null                  ,
        foundData       : []                    ,
        foundDataSlot   : null                  ,
        cacheBound      : []                    ,
                                                 
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
        activeHadith   : number[]              ,
        search_By       : TS.search_By          ,
        search_IN       : TS.Source             ,
                                                 
        fraseInSearch   : string                ,
        searched_By     : TS.search_By          ,
        foundData       : TS.FoundContent []    ,
        foundDataSlot   : "M1"|"M2"|"M3"|"M4"   ,
        cacheBound      : TS.RawBound           ,
                                                 
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
