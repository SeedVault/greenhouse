<template>
  <app-page>
    <template v-slot:main>

      <simple-box :title="Community">
        Content here
      </simple-box>

    </template>
    <router-view/>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';

export default {
  name: 'Community',
  components: {
    AppPage,
  },
  setup() {
  },
};

</script>
