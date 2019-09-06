<template>
  <public-layout>
    <div id="home">
      <div class="row align-items-center">
        <div class="col-12 col-md-5 col-lg-6 order-md-2">
          <img class="img-fluid mw-md-150 mw-lg-130 mb-6 mb-md-0"
          src="/images/home_greenhouse.svg" />
        </div>
        <div class="col-12 col-md-7 col-lg-6 order-md-1">
          <router-view/>
          <h1 class="display-3 text-center text-md-left">{{ $t('home.title') }}</h1>
          <p class="lead text-center text-md-left text-muted mb-6 mb-lg-8">
            {{ $t('home.subheadline') }}
          </p>
          <div class="text-center text-md-left">
            <router-link :to="{ name: 'dashboard'}" class="btn btn-primary lift mr-1 access-button">
              {{ $t('home.call_to_action') }}
              <img :src="require('@/assets/icons/ArrowOut-white@2x.svg')"
              class="d-none d-md-inline ml-3"/>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </public-layout>
</template>

<script>
import PublicLayout from '../layouts/PublicLayout.vue';

export default {
  name: 'Home',
  components: {
    PublicLayout,
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 48px;
  color: #323743;
  font-weight: 700;
  margin-bottom: 5px;
}

.mb-lg-8, .my-lg-8 {
  margin-bottom: 3rem !important;
}
.mb-6, .my-6 {
  margin-bottom: 2rem !important;
}

.access-button {
  font-size: 16px;
  font-weight: 400;
}
</style>
