import * as TS                          from "@/../types/myTypes"
import { fullScreenApplier }            from "./fullscreen"
import { statusBarIconStyleApplier }    from "./statusBarIconStyler"
import store                            from "@/store/store"

// -- =====================================================================================

interface themeValues {
    name: string,
    color: string,
    contrast: TS.B_W,
    statusBarIconsColor: {},
}

let themeValues = function ( color: string ): themeValues{

    return {
        name: color,
        color: TS.BGColors[ color ],
        contrast: TS.contentColorType[ color ],
        statusBarIconsColor: TS.contentColorType[ color ],
    }

};

// -- =====================================================================================

export function themeApplier ( colorName: TS.ThemeName, refs ): void {

    // .. get values of the Theme and Element(s)
    let palette = themeValues( colorName );

    // .. applying barIcon Color
    statusBarIconStyleApplier( palette.statusBarIconsColor );

    // .. this elements need to be cared of
    let obj = [ "root" ];

    // .. apply root ClassName
    refs[ obj[0] ].nativeView.className = palette.contrast + ' ' + palette.name;
 
    // .. apply Background values
    for ( let x of obj ) refs[x].nativeView.backgroundColor = palette.color;

    // .. register Theme
    store.state.appConfig.theme = colorName as TS.ThemeName;

    // .. register DarkMode
    store.state.appConfig.darkMode = palette.contrast === "dark" ? true : false;

    // .. applying fullScreen Policy
    fullScreenApplier();

}

// -- =====================================================================================

// export function darkModeToggler ( refs ) {

    // store.state.darkMode = !store.state.darkMode;

    // // TODO                               it should be completed
    // const newTheme: TS.ThemeName = store.state.darkMode ? "DarkGreen" : "Milky";
    // themeApplier( newTheme, refs );

    // // .. save config File
    // storage.saveAppConfig();

// }

// -- =====================================================================================
