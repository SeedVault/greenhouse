<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading"
        v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <divider-box v-show="!loading && !oops">
        <template v-slot:top>
          <div class="d-flex flex-column flex-lg-row align-items-center py-2">
            <div class="ml-1 flex-fill">
              <h1 class="h2 text-truncate mb-1 text-center text-lg-left font-weight-light"
              >Marketplace</h1>
            </div>
            <div class="justify-content-end mt-3 mt-lg-0">
              <div class="d-flex flex-column flex-sm-row menu">
                <router-link class="mb-2 mr-5" :to="{ name: 'marketplaceBots' }">
                  <div class="d-flex align-items-start">
                    <icon icon="bot" class="mr-1" /> {{ $t('products.bots') }}
                  </div>
                </router-link>
                <router-link class="mb-2 mr-5" :to="{ name: 'marketplaceComponents' }">
                  <div class="d-flex align-items-start">
                    <icon icon="component" class="mr-1" /> {{ $t('products.components') }}
                  </div>
                </router-link>
                <router-link class="mb-2" :to="{ name: 'marketplaceServices' }">
                  <div class="d-flex align-items-start">
                    <icon icon="service" class="mr-1" /> {{ $t('products.services') }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>

        </template>
        <template v-slot:main>
          <router-view></router-view>
        </template>
      </divider-box>

    </template>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';
import { reactive, toRefs } from '@vue/composition-api';

export default {
  name: 'Users',
  components: {
    AppPage,
  },
  setup() {
    const data = reactive({
      loading: false,
      oops: false,
      validationErrors: [],
    });

    return {
      ...toRefs(data),
    };
  },
};

</script>

<style lang="scss" scoped>
.top-height {
  height: 40px;
}

.menu {
  a {
    font-size: 16px;
    text-decoration: none;
    padding-top: 8px;
    color: #a3a8b0;
    img {
      min-width: 24px;
      width: 24px;
    }

    &.active {
      border-radius: 8px;
      color: #6b4c9f;
      font-weight: 500;
      img {
        filter: invert(38%) sepia(13%) saturate(2389%) hue-rotate(221deg)
        brightness(75%) contrast(92%);
      }
    }

    &:hover {
      color: #6b4c9f;
      font-weight: 500;
      img {
        filter: invert(38%) sepia(13%) saturate(2389%) hue-rotate(221deg)
        brightness(75%) contrast(92%);
      }
    }
  }
}
</style>
