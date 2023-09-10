<template>
<GridLayout>

    <FlexboxLayout
        flexWrap="wrap"
        flexDirection="row-reverse"
        justifyContent="center"
        ref="EditorPanel"
        row="1"
    >

        <ListPicker
            :items="names"
            :selectedIndex=hadith.obj.c
            class="name"
            @selectedIndexChange="hadith.obj.c=$event.value"
        />

        <Label class="divider" />
        <TextView :text=hadith.obj[0] class="text gray" @textChange="hadith.obj[0]=$event.value" />
        <Label class="divider" />
        <TextView :text=hadith.arabi class="text" @textChange="hadith.obj.a=$event.value" />
        <Label class="divider" />
        <TextView :text=hadith.obj[9] class="text gray" @textChange="hadith.obj[9]=$event.value" />
        <Label class="divider" />
        <TextView :text=hadith.farsi class="text" @textChange="hadith.obj.b=$event.value" />

    </FlexboxLayout>

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import * as NS                          from "@nativescript/core"
import * as TM                          from "@/themes/themeManager"
import * as storage                     from "@/mixins/storage"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"
import { c_map }                        from "@/../../db/H/info"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class EditorPanel extends Vue {

// -- =====================================================================================

@Prop() hadith: TS.Hadith;

// -- =====================================================================================

names = c_map.map( x => x[0] + " " + x[1] );

// -- =====================================================================================

mounted () {}

// -- =====================================================================================

init () {}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .paper {
        height: 63%;
        width: 72%;
    }

    .hadith {
        font-family: Amiri-Regular;
        text-align: center;
        font-size: 15.5;
        line-height: 7;
        padding: 3;
        border-radius: 5;
    }

    .CoolGreen  .hadith { color: #d8d8d8 }
    .Smoky      .hadith { color: #1e2224 }
    .Black      .hadith { color: #a8a8a8 }

    .CoolGreen  .green { color: #498c29 }
    .Smoky      .green { color: #3e9217 }
    .Black      .green { color: #3e9217 }

    .text {
        font-family: Amiri-Regular;
        font-size: 13;
        text-align: center;
        margin: 20;
        line-height: 20;
    }

    .gray {
        background-color: #1e2224;
        opacity: .5;
        margin: 0;
        width: 100%;
    }

    .CoolGreen  .text { color: #c5c5c5 }
    .Smoky      .text { color: #333333 }
    .Black      .text { color: #5e5e5e }

    .name {
        text-align: center;
        margin-bottom: 30;
        height: 90;
        width: 100%;
    }

    .CoolGreen  .name { color: #ffffff }
    .Smoky      .name { color: #ffffff }
    .Black      .name { color: #ffffff }

    .divider {
        width: 100%;
        height: 1;
        background-color: #1d80a7;
    }

    .alaem, .salam {
        font-size: 20;
        font-family: Alaem;
        padding-top: 15;
    }
    .alaem {
        padding: 15 7 0 7;
    }

    .CoolGreen .salam,
    .CoolGreen .alaem {
        color: #4dbae6;
    }

    .Smoky .salam,
    .Smoky .alaem {
        color: #1d80a7;
    }

    .Black .salam,
    .Black .alaem {
        color: #1d80a7;
    }
</style>