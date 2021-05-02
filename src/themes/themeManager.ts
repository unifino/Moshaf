import * as TS                          from "@/../types/myTypes"
import { fullScreenApplier }            from "./fullscreen"
import { statusBarIconStyleApplier }    from "./statusBarIconStyler"

// -- =====================================================================================

interface themeValues {
    name: string,
    contrast: TS.B_W,
    statusBarIconsColor: {},
}

let themeValues = function ( color: string ): themeValues{

    return {
        name: color,
        contrast: TS.contentColorType[ color ],
        statusBarIconsColor: TS.contentColorType[ color ],
    }

};

// -- =====================================================================================

export function init () {

    // .. get values of the Theme and Element(s)
    let palette = themeValues( "Black" );
    // .. applying barIcon Color
    statusBarIconStyleApplier( palette.statusBarIconsColor );
    // .. applying fullScreen Policy
    fullScreenApplier();

}

// -- =====================================================================================

// export function themeApplier ( colorName: TS.ThemaName, refs ): void {


    // // .. this elements need to be cared of
    // let obj = [ "root", "room", "salon_F" ];

    // // .. apply root ClassName
    // refs[ obj[0] ].nativeView.className = palette.contrast + ' ' + palette.name;
 
    // // .. apply Background values
    // for ( let x of obj ) refs[x].nativeView.backgroundColor = palette.rootBG;

    // // .. register Theme
    // store.state.appConfig.theme = colorName as TS.ThemaName;

    // // .. register DarkMode
    // store.state.darkMode = palette.contrast === "dark" ? true : false;

// }

// -- =====================================================================================

// export function darkModeToggler ( refs ) {

    // store.state.darkMode = !store.state.darkMode;

    // // TODO                               it should be completed
    // const newTheme: TS.ThemaName = store.state.darkMode ? "DarkGreen" : "Milky";
    // themeApplier( newTheme, refs );

    // // .. save config File
    // storage.saveAppConfig();

// }

// -- =====================================================================================
