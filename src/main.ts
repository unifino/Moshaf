declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import Vue                              from 'nativescript-vue'
import App_Basement                     from '@/components/Basement.vue'
import store                            from '@/store/store'
import * as NS                          from "@nativescript/core"

// -- =====================================================================================

if ( NS.isAndroid ) {

    NS.TextBase.prototype[ NS.fontSizeProperty.setNative ] = function ( value ) {

        if ( !this.formattedText || ( typeof value !== "number" ) ) {
            if ( typeof value === "number" ) {
               this.nativeTextViewProtected
               .setTextSize( android.util.TypedValue.COMPLEX_UNIT_DIP, value );
            }
            else {
                this.nativeTextViewProtected
                .setTextSize( android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize );
            }
        }

    }

}

// -- =====================================================================================

new Vue( {

    store,
    components: { App_Basement },
    template: `<GridLayout> <App_Basement /> </GridLayout>`,

} ).$start();

// -- =====================================================================================