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

export function themeApplier ( colorName: TS.ThemeName, that ): void {

    // .. get values of the Theme and Element(s)
    let palette = themeValues( colorName );

    // .. absolute locating
    that = that.$root.$children[0].$refs.root.nativeView;
    // .. apply root ClassName
    that.className = palette.contrast + ' ' + palette.name;
    // .. apply root Background value
    that.backgroundColor = palette.color;

    // .. applying barIcon Color
    statusBarIconStyleApplier( palette.statusBarIconsColor );
    // .. applying fullScreen Policy
    fullScreenApplier();

    // .. register Theme
    store.state.appConfig.theme = colorName as TS.ThemeName;
    // .. register DarkMode
    store.state.appConfig.darkMode = palette.contrast === "dark" ? true : false;

}

// -- =====================================================================================

export function themePatcher ( that ) {

    for ( let time of [ 1,300,700 ] ) {
        setTimeout( () => {
            // .. cache it
            let tmp = store.state.appConfig.theme;
            // .. purge Theme
            themeApplier( null, that );
            // .. re-apply the Theme
            themeApplier( tmp, that );
        }, time );
    }

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
