declare var android; // required if tns-platform-declarations is not installed

// -- =====================================================================================

import Vue                              from 'nativescript-vue'
import App_Basement                     from '@/components/Basement.vue'
import store                            from '@/store/store'
import * as NS                          from "@nativescript/core"

// -- =====================================================================================

if ( NS.isAndroid ) {

    NS.TextBase.prototype[ NS.fontSizeProperty.setNative ] = function ( v ) {

        if ( !this.formattedText || typeof v !== "number" ) {

            const typ = android.util.TypedValue;
            const dip = typ.COMPLEX_UNIT_DIP;
            const pix = typ.COMPLEX_UNIT_PX;
            const cnd = typeof v === "number";

            if ( cnd )      this.nativeTextViewProtected.setTextSize( dip, v );
            else this.nativeTextViewProtected.setTextSize( pix, v.nativeSize );

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