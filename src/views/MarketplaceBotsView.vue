<template>
  <div>
    <bot-view :screen="screen"></bot-view>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import BotView from '@/components/BotView.vue';

export default {
  components: {
    BotView,
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
