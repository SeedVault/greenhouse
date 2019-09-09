<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>
    Bot View
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';
import PictureChanger from 'seed-theme/src/components/PictureChanger.vue';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';
export default {
  name: 'ComponentsView',
  components: {
    AppLayout,
    StarRating,
    PictureChanger,
    draggable
  },
  data() {
    return {
      loading: false,
      oops: false,
    }
  }
}
</script>
<style lang="scss" scoped>

.view {

  color: #686b77;
  font-size: 16px;

  &__image {
    width: 100%;
    border-radius: 1rem !important;
  }

  &__title {
    font-size: 1.5rem;
    color: #212529;
  }

  &__subtitle {
    margin-top: 2rem;
    font-size: 1.2rem;
    color: #212529;
  }

  &__updatedAt {
    margin-left: 20px;
  }
}

.rating {
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.deleting {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

.addNewButton {
  margin-top: 2rem;
}

.smallButton {
  height: 32px;
}

</style>
