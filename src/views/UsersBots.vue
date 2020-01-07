<template>
  <div>
    <bot-list screen="users"></bot-list>
  </div>
</template>

<script>

import { reactive, toRefs } from '@vue/composition-api';
import BotList from '@/components/BotList.vue';

export default {
  components: {
    BotList,
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
