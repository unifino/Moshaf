import Vue                              from 'nativescript-vue'
import Base                             from './components/Base.vue'
import store                            from './store/store'
import * as NS                          from "@nativescript/core"

declare var android; // required if tns-platform-declarations is not installed

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

    };

}

// -- =====================================================================================

new Vue( {

  store ,

// -- =====================================================================================

  template: `

      <GridLayout>
          <Base />
      </GridLayout>` ,

// -- =====================================================================================

  components: { Base } ,

// -- =====================================================================================

} ).$start();

// -- =====================================================================================

// import Vue from 'nativescript-vue'
// import App from './components/App.vue'
// import VueDevtools from 'nativescript-vue-devtools'

// if(TNS_ENV !== 'production') {
//   Vue.use(VueDevtools)
// }
// import store from './store'

// // Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = (TNS_ENV === 'production')

// new Vue({
//   store,
//   render: h => h('frame', [h(App)])
// }).$start()