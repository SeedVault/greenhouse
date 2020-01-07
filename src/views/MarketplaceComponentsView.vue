<template>
  <div>
    <component-view :services-only="servicesOnly" :screen="screen"></component-view>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import ComponentView from '@/components/ComponentView.vue';

export default {
  components: {
    ComponentView,
  },
  setup() {
    const data = reactive({
      servicesOnly: false,
      screen: 'marketplace',
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
