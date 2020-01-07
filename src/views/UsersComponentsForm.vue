<template>
  <div>
    <component-form :services-only="servicesOnly"></component-form>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import ComponentForm from '@/components/ComponentForm.vue';

export default {
  components: {
    ComponentForm,
  },
  setup() {
    const data = reactive({
      servicesOnly: false,
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
