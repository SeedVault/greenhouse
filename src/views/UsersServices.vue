<template>
  <div>
    <component-list :services-only="servicesOnly" screen="users"></component-list>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import ComponentList from '@/components/ComponentList.vue';

export default {
  components: {
    ComponentList,
  },
  setup() {
    const data = reactive({
      servicesOnly: true,
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
