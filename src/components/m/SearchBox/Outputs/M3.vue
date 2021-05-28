<template>
<GridLayout :visibility="visibility" class="outputBox transparent">

<!---------------------------------------------------------------------------------------->

    <ScrollView verticalAlignment="middle" marginTop="20">

        <FlexboxLayout
            flexWrap="wrap"
            flexDirection="row-reverse"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Label
                v-for="(item,i) in $store.state.foundData"
                :key="i"
                :class="tagClasser(item)"
                :text="item.text"
                textWrap=true
                @tap="tagToggler(item)" 
            />

        </FlexboxLayout>

    </ScrollView>

<!---------------------------------------------------------------------------------------->

</GridLayout>
</template>

// -- =====================================================================================

<script lang="ts">

// -- =====================================================================================

import { Vue, Component, Prop }         from "vue-property-decorator"
import * as TS                          from "@/../types/myTypes"
import * as tools                       from "@/mixins/tools"
import store                            from "@/store/store"

// -- =====================================================================================

@Component ( {
    components: {}
} )

// -- =====================================================================================

export default class Output_M3 extends Vue {

// -- =====================================================================================

get visibility () {
    return store.state.foundData.length && store.state.foundDataSlot === "M3" ? 
        'visible' : 'hidden';
}

// -- =====================================================================================

tagClasser ( item: TS.FoundContent ) {
    let tagClass = 'tag';
    if ( item.flags.isBounded ) tagClass += ' bounded';
    if ( item.flags.isCached ) tagClass += ' cached';
    return tagClass;
}

// -- =====================================================================================

tagToggler ( item: TS.FoundContent ) {
    tools.bound_Q_Toggler( item );
    store.state.foundData = tools.getTags();
}

// -- =====================================================================================

}

// -- =====================================================================================

</script>

// -- =====================================================================================

<style scoped>

/* ------------------------------------------- */
    .tag {
        font-family: Amiri-Regular;
        font-size: 18;
        padding: -5 12 5 12;
        margin: 3;
        border-radius: 4;
    }

    .CoolGreen .tag {
        background-color: #343534;
        color: #e0e0e0;
    }

    .Smoky .tag {
        background-color: #343534;
        color: #e0e0e0;
    }

    .CoolGreen .bounded,
    .Smoky .bounded {
        background-color: #0e962b;
        color: white;
    }

    .transparent {
        background-color: #332c2c2c;
    }


</style>