<template>
  <div>
    <bot-form></bot-form>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import BotForm from '@/components/BotForm.vue';

export default {
  components: {
    BotForm,
  },
  setup() {
    const data = reactive({
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
