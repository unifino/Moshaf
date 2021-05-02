import { NativeScriptConfig } from '@nativescript/core'

export default {
    id: 'moshaf.fitored.ir',
    appPath: 'src',
    appResourcesPath: 'App_Resources',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none',
        codeCache: true
    },
    ios: {
        codeCache: true
    }
} as NativeScriptConfig
