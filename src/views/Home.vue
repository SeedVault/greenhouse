<template>
  <landing-page action-route="dashboard">
    <template v-slot:title>
      {{ $t('home.title') }}
    </template>
    <template v-slot:subheadline>
      {{ $t('home.subheadline') }}
    </template>
    <template v-slot:call_to_action>
      {{ $t('home.call_to_action') }}
    </template>
    <router-view/>
  </landing-page>
</template>

<script>
import LandingPage from 'seed-theme/src/layouts/LandingPage.vue';

export default {
  name: 'Home',
  components: {
    LandingPage,
  },
};
</script>
