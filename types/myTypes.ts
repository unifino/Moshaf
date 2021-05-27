// -- =====================================================================================

export type ThemeName = 
      'White' 
    | 'Smoky' 
    | 'Milky' 
    | 'Black' 
    | 'CoolGreen' 
    | 'DarkGreen' 
    | 'WarmBlue' 
    | 'CozyBlue' 
    | 'AppBlue' 
    ;

export type ThemeNameName_Light = 
      'White'
    | 'Smoky'
    | 'Milky'
    ;

export type ThemeName_Dark = 
      'Black'
    | 'CoolGreen' 
    | 'DarkGreen' 
    | 'GreatGray' 
    | 'WarmBlue' 
    | 'CozyBlue' 
    | 'AppBlue'
    ;

export enum BGColors { 

    White       = "#FFFFFF" ,
    Smoky       = "#e6e6e6" ,
    Milky       = "#fcefe6" ,
    Black       = "#000000" ,
    CoolGreen   = "#08332f" ,
    DarkGreen   = "#0a1c20" ,
    GreatGray   = "#1e2c2f" ,
    WarmBlue    = "#125689" ,
    CozyBlue    = "#3181a6" ,
    AppBlue     = "#135f82" ,

}

// .. the value use for className
export enum B_W {
    Black = "light",
    White = "dark"
}

export enum contentColorType { 

    White       = B_W.Black ,
    Smoky       = B_W.Black ,
    Milky       = B_W.Black ,
    Black       = B_W.White ,
    CoolGreen   = B_W.White ,
    DarkGreen   = B_W.White ,
    GreatGray   = B_W.White ,
    WarmBlue    = B_W.White ,
    CozyBlue    = B_W.White ,
    AppBlue     = B_W.White ,

}

// -- =====================================================================================

export type here =
      'Basement'

    | 'Base_00'
    | 'Qertas'

    | 'Base_01'
    | 'Day'

    | 'Base_10'
    | 'Najwa'

    | 'Lookup'
    ;

// -- =====================================================================================

export type vahy = {
    aID: number,
    text: string, 
    type: Kalameh
}[];

// -- =====================================================================================

export type Kalameh =
      "quran"
    | "number"
    | "ESM"
    | "sajdeh"
    | "hadis"
    | "salam"
    | "green"
    | "najwa"
    | "BREAKLINE"
    | "BIG_BREAKLINE"
    ;

// -- =====================================================================================

export type Source = "Q" | "H" | "N" | "T";

// -- =====================================================================================

export type SearchMode = "phrase" | "history" | "favorite" | "tag";

// -- =====================================================================================

// export type Found_Item = { 
//     text        : string    , 
//     idx         : number    ,
//     isBounded   : boolean   ,
//     source?     : Source    ,
// };
// export type Found = Found_Item[];

// export interface BoundItem {
//     [0]: [ "Q" | "H", number ],
//     [1]: [ "Q" | "H", number ] | [ "T", string ],
//     length : 2,
// }[];

// export type Bound = BoundItem[];

// -- =====================================================================================

export type FoundContent = {
    id              : number    ,
    text            : string    ,
    source          : Source    ,
    flags           : Flags     ,
};

export type Flags = {
    isActivated?: boolean   ,
    isBounded?  : boolean   ,
    isHeader?   : boolean   ,
    isCached?   : boolean   ,
    count?      : number    ,
}

// -- =====================================================================================

export type CakeBound = {
    [key: string]: string[],
}

// -- =====================================================================================
