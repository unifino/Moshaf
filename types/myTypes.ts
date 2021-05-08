// -- =====================================================================================

export type ThemaName = 
      'White' 
    | 'Smoky' 
    | 'Milky' 
    | 'Black' 
    | 'DarkGreen' 
    | 'WarmBlue' 
    | 'CozyBlue' 
    | 'AppBlue' 
    ;

export type ThemaName_Light = 
      'White'
    | 'Smoky'
    | 'Milky'
    ;

export type ThemaName_Dark = 
      'Black'
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
    DarkGreen   = B_W.White ,
    GreatGray   = B_W.White ,
    WarmBlue    = B_W.White ,
    CozyBlue    = B_W.White ,
    AppBlue     = B_W.White ,

}

// -- =====================================================================================

export type here =
      'Base'
    | 'Fehrest'
    | 'Ghertas'
    | 'Lookup'
    | 'Hadis'
    ;

// -- =====================================================================================

export type vahy = { 
    text: string, 
    fullText?: string,
    type: "ESM"|"string"|"number"|"sajdeh" 
}[];