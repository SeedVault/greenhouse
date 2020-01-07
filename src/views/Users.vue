<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops || !userFound">
        <loading-checkmark visible="false" :loading="loading"
        v-if="!oops && userFound"></loading-checkmark>
        <oops v-show="oops"></oops>
        <custom-error v-if="!userFound" :title="$t('domain.user.validation.user_not_found')">
        </custom-error>
      </full-centered>

      <divider-box v-show="!loading && !oops && userFound">
        <template v-slot:top>
          <div class="d-flex flex-column flex-lg-row align-items-center py-2">
            <div class="mb-2 mb-lg-0">
              <img
                class="user-picture align-self-start mr-lg-3 rounded-circle"
                :src="user.pictureUrl" />
            </div>
            <div class="ml-1 flex-fill">
              <h1 class="h4 text-truncate mb-1 text-center text-lg-left font-weight-light"
              >{{ user.username }}</h1>
              <div class="user-country text-truncate text-center
               text-md-left"><icon icon="location-filled" style="height: 1.2em; margin-right: 4px;"
                />{{ countryName() }}</div>
            </div>
            <div class="justify-content-end mt-3 mt-lg-0">
              <div class="d-flex flex-column flex-sm-row menu">
                <router-link class="mb-2 mr-5" :to="{ name: 'usersBots',
                  params: { username:  username }}">
                  <div class="d-flex align-items-start">
                    <icon icon="bot" class="mr-1" /> {{ $t('products.bots') }}
                  </div>
                </router-link>
                <router-link class="mb-2 mr-5" :to="{ name: 'usersComponents',
                  params: { username:  username }}">
                  <div class="d-flex align-items-start">
                    <icon icon="component" class="mr-1" /> {{ $t('products.components') }}
                  </div>
                </router-link>
                <router-link class="mb-2" :to="{ name: 'usersServices',
                  params: { username:  username }}">
                  <div class="d-flex align-items-start">
                    <icon icon="service" class="mr-1" /> {{ $t('products.services') }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>


          <!-- <div class="form-row">
            <div class="col-6 col-sm-12 col-lg-6 mb-2">
              <div class="d-flex flex-column flex-sm-row menu">
                <router-link class="mb-2 mr-5" :to="{ name: 'productsBots' }">
                  <div class="d-flex align-items-start">
                    <icon icon="bot" class="mr-1" /> {{ $t('products.bots') }}
                  </div>
                </router-link>
                <router-link class="mb-2" :to="{ name: 'usersComponents' }">
                  <div class="d-flex align-items-start">
                    <icon icon="service" class="mr-1" /> {{ $t('products.services') }}
                  </div>
                </router-link>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-2 mb-2">
              <button @click.prevent="addNew"
              class="btn top-height btn-primary font-weight-bold w-xs-100">+
                {{ $t('common.add_new') }}</button>
            </div>
            <div class="col-12 col-sm-6 col-lg-4 mb-2">
              <input-search v-model="search" id="search"
              :placeholder="$t('common.search')"
              :validationErrors="validationErrors"
              @do-search="doSearch"></input-search>
            </div>
          </div> -->
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
import { reactive, toRefs, watch } from '@vue/composition-api';

export default {
  name: 'Users',
  components: {
    AppPage,
  },
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      validationErrors: [],
      username: '',
      user: { },
      userFound: true,
    });

    // console.log(context.root.$route.params.username);

    if (typeof context.root.$route.params.username === 'undefined') {
      data.username = '';
      data.userFound = false;
    } else {
      data.username = context.root.$route.params.username;
    }

    async function getUser() {
      try {
        data.loading = true;
        data.userFound = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/users/${encodeURI(data.username)}`);
        data.user = response.data;
        data.loading = false;
      } catch (error) {
        data.loading = false;
        if (error.response.status === 404) {
          data.userFound = false;
        } else {
          data.oops = true;
        }
      }
    }

    function countryName() {
      if (typeof data.user === 'undefined' || typeof data.user.countryCode === 'undefined') {
        return '';
      }
      return context.root.$i18n.t(`domain.countries.${data.user.countryCode}`);
    }

    watch(() => context.root.$route.params, (value) => {
      if (typeof value.username !== 'undefined') {
        data.username = value.username;
        getUser();
      }
    });


    return {
      ...toRefs(data), countryName,
    };
  },
};

</script>

<style lang="scss" scoped>
.top-height {
  height: 40px;
}

.user {
  &-picture {
    width: 100px;
    height: 100px;
  }

  &-username {
    font-size: 16px;
    line-height: 1.5rem;
  }

  &-country {
    color: #a3a8b0;
  }
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
