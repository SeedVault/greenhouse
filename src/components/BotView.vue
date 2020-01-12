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
              <img :src="bot.pictureUrl" class="rounded-lg" />
            </template>
          </div>
          <div class="flex-fill pr-sm-3">
            <h1 class="h3">{{ bot.name }}</h1>
            <div class="d-flex flex-column flex-lg-row mb-sm-3
              view__metadata">
              <div class="mr-sm-3 mb-2">
                <star-rating :rating="3.5" :increment="0.5" :star-size="18"
                :show-rating="false" :inline="true" :read-only="true"></star-rating>
              </div>
            </div>

            <div class="d-flex flex-column flex-xl-row mb-sm-3 mb-4 display-1 align-items-baseline">
                <div v-if="bot.pricingModel === 'free'">
                  {{ $t('common.free') }}
                </div>
                <div v-if="bot.pricingModel === 'pay_per_use'||
                  bot.pricingModel === 'pay_per_use_or_month'">
                  <icon icon="seed-symbol" class="view__token-symbol" />
                  {{ bot.pricePerUse }}<small
                  class="text-black-50 medium-text">/ {{ $t('common.use')}}</small>
                </div>
                <div v-if="bot.pricingModel === 'pay_per_use_or_month'"
                class="d-none d-xl-block">
                  <span class=" mx-4 border-right"></span>
                </div>
                <div v-if="bot.pricingModel === 'pay_per_month'||
                  bot.pricingModel === 'pay_per_use_or_month'">
                  <icon icon="seed-symbol" class="view__token-symbol" />
                  {{ bot.pricePerMonth }}<small
                  class="text-black-50 medium-text">/ {{ $t('common.month')}}</small>
                </div>
            </div>

            <div class="d-flex flex-column flex-xl-row mb-sm-3
              view__metadata">
              <div class="pr-lg-2 mb-2 view__horizontal-separator">
                {{ $t("common.by") }} {{ bot.user.username }}
              </div>
              <div class="ml-lg-2 pr-sm-2 mb-2 view__horizontal-separator">
                <icon icon="tag" class="view__icon-tag" />
                {{ $t(`domain.bot_categories.${bot.category}`) }}
              </div>
              <div class="ml-lg-2 mb-2">
                <icon icon="timer" class="view__icon-timer" />
                {{ $t("bots.updated") }}
                {{ humanDate(bot.updatedAt) }}
                <!-- {{ $d(Date.parse(bot.updatedAt), 'short') }} -->
              </div>
            </div>

            <ul class="nav nav-underline mt-4 mb-4 medium-text">
              <li class="nav-item active">
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'description' }]">
                <a class="nav-link pl-0"
                @click="selectedTab='description'"
                >{{ $t("domain.bot.description") }}</a>
              </li>
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'features' }]">
                <a class="nav-link" @click="selectedTab='features'"
                >{{ $t("domain.bot.features") }}</a>
              </li>
              <li v-bind:class="['nav-item', { 'active': selectedTab === 'license' }]">
                <a class="nav-link" @click="selectedTab='license'"
                >{{ $t("domain.bot.license") }}</a>
              </li>
            </ul>

            <div v-show="selectedTab === 'description'">
              <h2 class="h5">{{ $t("domain.bot.description") }}</h2>
              <p class="nl2br text-black-50 medium-text mb-4">{{ bot.description }}</p>

              <h2 class="h5">{{ $t("domain.bot.status") }}</h2>
              <p class="nl2br text-black-50 medium-text">
                {{ $t(`domain.bot_statuses.${bot.status}`) }}
              </p>
            </div>

            <div v-show="selectedTab === 'features'">
              <h2 class="h5"></h2>
              <p class="nl2br text-black-50 medium-text">{{ bot.features }}</p>
            </div>

            <div v-show="selectedTab === 'license'">
              <h2 class="h5"></h2>
              <p class="nl2br text-black-50 medium-text">{{ bot.license }}</p>
            </div>

          </div>
          <div class="d-flex flex-column align-items-center">
            <template v-if="canWrite()">
              <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
              @click.prevent="editBot()">
                {{ $t('common.modify') }}
              </a>
            </template>
            <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
            @click.prevent="subscribe()" v-show="!subscribed">
              {{ $t('bots.subscribe') }}
            </a>
            <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
            @click.prevent="subscribe()" v-show="subscribed">
              {{ $t('bots.configure') }}
            </a>
            <template v-if="canWrite()">
              <a href="#" class="btn btn-md btn-danger btn-block font-weight-bold px-5"
              @click.prevent="deleteBot()">
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
  name: 'BotView',
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
      bot: {
        category: 'general',
        status: 'enabled',
        user: {},
      },
      subscribed: false,
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
          name: 'usersBots',
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
          name: 'marketplaceBots',
        };
      }
      return false;
    }

    async function getBot() {
      try {
        data.loading = true;
        data.oops = false;
        const response = await context.root.axios.get(`/bots/${data.id}/subscription`);
        data.bot = response.data.bot;
        data.subscribed = response.data.token !== '';
        if (canWrite()) {
          context.refs.pictureChanger.loadImage(
            data.bot.pictureUrl,
            `${data.id}.jpg`,
            `/bots/${data.id}/change-picture`,
          );
        }
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    function editBot() {
      const { id } = data;
      let routeName = 'usersBotsForm';
      if (props.servicesOnly === true) {
        routeName = 'usersServicesForm';
      }
      context.root.$router.push({ name: routeName, params: { id } });
    }

    function subscribe() {
      const { id } = data;
      let routeName = 'marketplaceBotsConfigure';
      if (props.screen === 'users') {
        routeName = 'usersBotsConfigure';
      }
      this.$router.push({ name: routeName, params: { id } });
    }

    async function deleteBot() {
      const confirmed = await context.root.$bvModal.msgBoxConfirm(
        context.root.$i18n.t('bots.delete_this_bot'), {
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
        await context.root.axios.delete(`/bots/${data.id}/delete`);
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


    getBot();

    return {
      ...toRefs(data),
      getBot,
      editBot,
      subscribe,
      deleteBot,
      urlToGoBack,
      canWrite,
    };
  },
};

</script>
