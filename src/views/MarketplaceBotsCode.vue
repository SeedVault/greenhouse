<template>
  <div>
    <bot-code :screen="screen"></bot-code>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import BotCode from '@/components/BotCode.vue';

export default {
  components: {
    BotCode,
  },
  setup() {
    const data = reactive({
      screen: 'marketplace',
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
