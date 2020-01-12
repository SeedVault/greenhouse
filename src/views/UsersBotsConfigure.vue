<template>
  <div>
    <bot-configure :screen="screen"></bot-configure>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import BotConfigure from '@/components/BotConfigure.vue';

export default {
  components: {
    BotConfigure,
  },
  setup() {
    const data = reactive({
      screen: 'users',
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>
