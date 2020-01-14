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

        <template v-show="subscribed">
          <span id="hadron-container"
            data-bot-first-message="Hi"
            data-bot-size-class="tall"
            data-bot-placeholder=""
            data-bot-talks-first="true"
            data-bot-subtitle=""
            data-bot-voice-recognition-visible="true"
            data-bot-voice-recognition-continuous="true"
            data-bot-voice-recognition-stoplistening-command="stop listening"
            :data-bot-title="bot.name"
            :data-bot-external-css="getHadronUrl('/sprout/sequoia_b.css')"
            :data-bot-launcher-external-css="getHadronUrl('/sprout/sequoia-launcher_b.css')"
            data-bot-load-font="Montserrat:300,400,600"
            :data-bot-bbot-uri="getRhizomeUrl('')"
            data-bot-close-button-action="unload"
            data-bot-auto-opens="true"
            data-bot-remembers-state="false"
            :data-bot-publisher-token="subscription.token"
            data-bot-uses-3d-avatar="true"
            data-bot-uses-3d-text-panel="false"
            data-bot-uses-3d-avatar-cam-pos-x="5"
            data-bot-uses-3d-avatar-cam-pos-y="72"
            data-bot-uses-3d-avatar-cam-pos-z="60"
            data-bot-uses-3d-avatar-cam-target-pos-x="0"
            data-bot-uses-3d-avatar-cam-target-pos-y="72"
            data-bot-uses-3d-avatar-cam-target-pos-z="0"
            data-bot-tts-locale="en_GB"
            data-bot-tts-voice-id="0"
            data-bot-track-anonymous-user-id="true"
          ></span>
        </template>

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
            @click.prevent="subscribe()" v-show="!subscribed && canUnsubscribe()">
              {{ $t('bots.subscribe') }}
            </a>
            <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
            @click.prevent="subscribe()" v-show="subscribed">
              {{ $t('bots.configure') }}
            </a>
            <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
            @click.prevent="testBot()" v-show="subscribed">
              {{ $t('bots.test_bot') }}
            </a>
            <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
            @click.prevent="viewCode()" v-show="subscribed">
              {{ $t('bots.view_code') }}
            </a>
            <a href="#" class="btn btn-md btn-danger btn-block font-weight-bold px-5"
            @click.prevent="unsubscribe()"
            v-show="subscribed && canUnsubscribe()">
              {{ $t('bots.unsubscribe') }}
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
import { reactive, toRefs, onBeforeUnmount } from '@vue/composition-api';
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
      subscription: {},
      subscribed: false,
      selectedTab: 'description',
    });

    onBeforeUnmount(() => {
      // context.root.removeHadron();
    });

    function getHadronUrl(suffix) {
      return process.env.VUE_APP_HADRON_URL + suffix;
    }

    function getRhizomeUrl(suffix) {
      return process.env.VUE_APP_RHIZOME_URL + suffix;
    }

    function removeHadron() {
      if (typeof window.inToggle !== 'undefined') {
        window.inToggle.hideHadron();
      }
    }

    function injectHadron() {
      if (typeof window.inToggle === 'undefined') {
        const script = document.createElement('script');
        script.onload = () => { };
        script.src = this.getHadronUrl('/launcher.bundle.js');
        document.head.appendChild(script);
      } else {
        window.inToggle.init();
      }
    }

    data.id = context.root.$route.params.id;

    function canWrite() {
      return props.screen === 'users'
      && context.root.$route.params.username === context.root.$store.getters.user.username;
    }

    function canUnsubscribe() {
      return data.bot.user.username !== context.root.$store.getters.user.username;
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
        data.subscription = response.data;
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

    function testBot() {
      this.removeHadron();
      this.injectHadron();
    }

    function viewCode() {
      const { id } = data;
      let routeName = 'marketplaceBotsCode';
      if (props.screen === 'users') {
        routeName = 'usersBotsCode';
      }
      this.$router.push({ name: routeName, params: { id } });
    }

    async function unsubscribe() {
      const confirmed = await context.root.$bvModal.msgBoxConfirm(
        context.root.$i18n.t('bots.unsubscribe_from_this_bot'), {
          okVariant: 'danger',
          okTitle: context.root.$i18n.t('bots.unsubscribe'),
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
        await context.root.axios.post(`/bots/${data.id}/unsubscribe`);
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
      getHadronUrl,
      getRhizomeUrl,
      removeHadron,
      injectHadron,
      getBot,
      editBot,
      subscribe,
      testBot,
      viewCode,
      unsubscribe,
      deleteBot,
      urlToGoBack,
      canWrite,
      canUnsubscribe,
    };
  },
};

</script>
