<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <back-box :to="urlToGoBack()" v-show="!loading && !oops">

        <little-centered v-slot:main v-if="deleting || deleted">
          <loading-checkmark visible="false" :loading="deleting" :showCheckmark="deleted" >
            <template v-slot:messages>
              <div v-if="deleting && !deleted">
                {{ $t('common.please_wait') }}
              </div>
              <div v-if="deleted">
                {{ $t('common.done') }}
              </div>
            </template>
          </loading-checkmark>
        </little-centered>

        <div class="d-flex flex-column flex-md-row mt-3" v-if="!deleting && !deleted">
          <div class="pr-sm-4">
            <template v-if="canWrite()">
              <picture-changer ref="pictureChanger"></picture-changer>
            </template>
            <template v-else>
              <img :src="component.pictureUrl" class="rounded-lg" />
            </template>
          </div>
          <div class="flex-fill pr-sm-3">
            <h1 class="h3">{{ component.name }}</h1>
            <div class="d-flex flex-column flex-lg-row mb-sm-3
              view__metadata">
              <div class="mr-sm-3 mb-2">
                <star-rating :rating="3.5" :increment="0.5" :star-size="18"
                :show-rating="false" :inline="true" :read-only="true"></star-rating>
              </div>
            </div>

            <div class="d-flex flex-column flex-xl-row mb-sm-3 mb-4 display-1 align-items-baseline">
                <div v-if="component.pricingModel === 'free'">
                  {{ $t('common.free') }}
                </div>
                <div v-if="component.pricingModel === 'pay_per_use'||
                  component.pricingModel === 'pay_per_use_or_month'">
                  <icon icon="seed-symbol" class="view__token-symbol" />
                  {{ component.pricePerUse }}<small
                  class="text-black-50 medium-text">/ {{ $t('common.use')}}</small>
                </div>
                <div v-if="component.pricingModel === 'pay_per_use_or_month'"
                class="d-none d-xl-block">
                  <span class=" mx-4 border-right"></span>
                </div>
                <div v-if="component.pricingModel === 'pay_per_month'||
                  component.pricingModel === 'pay_per_use_or_month'">
                  <icon icon="seed-symbol" class="view__token-symbol" />
                  {{ component.pricePerMonth }}<small
                  class="text-black-50 medium-text">/ {{ $t('common.month')}}</small>
                </div>
            </div>

            <div class="d-flex flex-column flex-xl-row mb-sm-3
              view__metadata">
              <div class="pr-lg-2 mb-2 view__horizontal-separator">
                {{ $t("common.by") }} {{ component.user.username }}
              </div>
              <div class="ml-lg-2 pr-sm-2 mb-2 view__horizontal-separator">
                <icon icon="tag" class="view__icon-tag" />
                {{ $t(`domain.component_categories.${component.category}`) }}
              </div>
              <div class="ml-lg-2 mb-2">
                <icon icon="timer" class="view__icon-timer" />
                {{ $t("components.updated") }}
                {{ humanDate(component.updatedAt) }}
                <!-- {{ $d(Date.parse(component.updatedAt), 'short') }} -->
              </div>
            </div>

            <ul class="nav nav-underline mt-4 mb-4 medium-text">
              <li class="nav-item active">
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'description' }]">
                <a class="nav-link pl-0"
                @click="selectedTab='description'"
                >{{ $t("domain.component.description") }}</a>
              </li>
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'features' }]">
                <a class="nav-link" @click="selectedTab='features'"
                >{{ $t("domain.component.features") }}</a>
              </li>
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'license' }]">
                <a class="nav-link" @click="selectedTab='license'"
                >{{ $t("domain.component.license") }}</a>
              </li>
            </ul>

            <div v-show="selectedTab === 'description'">
              <h2 class="h5">{{ $t("domain.component.description") }}</h2>
              <p class="nl2br text-black-50 medium-text mb-4">{{ component.description }}</p>

              <h2 class="h5">{{ $t("domain.component.url") }}</h2>
              <p class="nl2br text-black-50 medium-text mb-4">
                <a :href="component.url" target="_blank">{{ component.url }}</a>
              </p>

              <h2 class="h5">{{ $t("domain.component.key") }}</h2>
              <p class="nl2br text-black-50 medium-text mb-4">{{ component.key }}</p>

              <h2 class="h5">{{ $t("domain.component.function_name") }}</h2>
              <p class="nl2br text-black-50 medium-text mb-4">{{ component.functionName }}</p>

              <h2 class="h5">{{ $t("domain.component.status") }}</h2>
              <p class="nl2br text-black-50 medium-text">
                {{ $t(`domain.component_statuses.${component.status}`) }}
              </p>
            </div>

            <div v-show="selectedTab === 'features'">
              <h2 class="h5"></h2>
              <p class="nl2br text-black-50 medium-text">{{ component.features }}</p>
            </div>

            <div v-show="selectedTab === 'license'">
              <h2 class="h5"></h2>
              <p class="nl2br text-black-50 medium-text">{{ component.license }}</p>
            </div>

          </div>
          <div class="d-flex flex-column align-items-center">
            <template v-if="canWrite()">
              <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
              @click.prevent="editComponent()">
                {{ $t('common.modify') }}
              </a>
              <a href="#" class="btn btn-md btn-danger btn-block font-weight-bold px-5"
              @click.prevent="deleteComponent()">
                {{ $t('common.delete') }}
              </a>
            </template>
          </div>
        </div>
      </back-box>

    </template>
    <router-view/>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';
import PictureChanger from 'seed-theme/src/components/PictureChanger.vue';
import { reactive, toRefs } from '@vue/composition-api';
import StarRating from 'vue-star-rating';

export default {
  name: 'ComponentView',
  components: {
    AppPage,
    PictureChanger,
    StarRating,
  },
  props: ['servicesOnly', 'screen'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      id: '',
      component: {
        category: 'general',
        status: 'enabled',
        user: {},
      },
      selectedTab: 'description',
    });

    data.id = context.root.$route.params.id;

    function canWrite() {
      return props.screen === 'users'
      && context.root.$route.params.username === context.root.$store.getters.user.username;
    }

    function urlToGoBack() {
      if (props.screen === 'users') {
        if (props.servicesOnly) {
          return {
            name: 'usersServices',
            params: { username: context.root.$route.params.username },
          };
        }
        return {
          name: 'usersComponents',
          params: { username: context.root.$route.params.username },
        };
      }
      if (props.screen === 'marketplace') {
        if (props.servicesOnly) {
          return {
            name: 'marketplaceServices',
          };
        }
        return {
          name: 'marketplaceComponents',
        };
      }
      return false;
    }

    async function getComponent() {
      try {
        data.loading = true;
        data.oops = false;
        const response = await context.root.axios.get(`/components/${data.id}`);
        data.component = response.data;
        if (canWrite()) {
          context.refs.pictureChanger.loadImage(
            data.component.pictureUrl,
            `${data.id}.jpg`,
            `/components/${data.id}/change-picture`,
          );
        }
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    function editComponent() {
      const { id } = data;
      let routeName = 'usersComponentsForm';
      if (props.servicesOnly === true) {
        routeName = 'usersServicesForm';
      }
      context.root.$router.push({ name: routeName, params: { id } });
    }

    async function deleteComponent() {
      const confirmed = await context.root.$bvModal.msgBoxConfirm(
        context.root.$i18n.t('components.delete_this_component'), {
          okVariant: 'danger',
          okTitle: context.root.$i18n.t('common.delete'),
          centered: true,
        },
      );
      if (confirmed === false) {
        return false;
      }
      try {
        data.deleting = true;
        data.deleted = false;
        data.oops = false;
        await context.root.axios.delete(`/components/${data.id}/delete`);
        data.deleting = false;
        data.deleted = true;
        setTimeout(() => {
          context.root.$router.push(urlToGoBack());
        }, 1000);
      } catch (error) {
        data.deleting = false;
        if (error.response.status === 422) {
          data.validationErrors = context.root.normalizeErrors(error.response);
        } else {
          data.oops = true;
        }
      }
      return true;
    }

    getComponent();

    return {
      ...toRefs(data),
      getComponent,
      editComponent,
      deleteComponent,
      urlToGoBack,
      canWrite,
    };
  },
};

</script>
