<template>
  <app-layout>
    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="getBackUrl">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')"
              /> {{ $t('common.back') }}
            </router-link>

            <div class="deleting text-center" v-show="deleting || deleted">
              <div v-bind:class="[{ 'load-complete': deleted }, 'circle-loader circle-text']">
                <div class="checkmark draw" v-show="deleted"></div>
              </div>
              <div v-if="deleting && !deleted">
                {{ $t('common.please_wait') }}
              </div>
            </div>

            <template v-show="token !== ''">
              <span id="hadron-container"
                data-bot-first-message="Hi"
                data-bot-size-class="tall"
                data-bot-placeholder=""
                data-bot-talks-first="true"
                data-bot-subtitle=""
                data-bot-voice-recognition-visible="false"
                :data-bot-title="name"
                :data-bot-external-css="getHadronUrl('/sprout/sequoia_b.css')"
                :data-bot-launcher-external-css="getHadronUrl('/sprout/sequoia-launcher_b.css')"
                data-bot-load-font="Montserrat:300,400,600"
                :data-bot-bbot-uri="getRhizomeUrl('/')"
                data-bot-close-button-action="unload"
                data-bot-auto-opens="true"
                data-bot-remembers-state="false"
                :data-bot-publisher-token="token"
                data-bot-uses-3d-avatar="true"
                data-bot-uses-3d-text-panel="false"
              ></span>
            </template>

            <div class="row row-form view" v-show="!deleting && !deleted">
              <div class="col-md-3">
                <picture-changer ref="pictureChanger"
                v-show="username === this.$store.getters.user.username && context == 'myProducts'"
                ></picture-changer>
                <img :src="pictureUrl" class="img-fluid img-view"
                v-show="context !== 'myProducts'"/>
              </div>

              <div class="col-md-7">
                <h1 class="view__title">{{ name }}</h1>
                <p>by <strong>{{ username }}</strong></p>

                <div v-if="pricingModel === 'free'">
                  <p>{{ $t("domain.bot.price") }}: <strong>
                  {{ $t('common.free') }}
                  </strong></p>
                </div>
                <div
                v-if="pricingModel === 'pay_per_use' || pricingModel === 'pay_per_use_or_month'">
                  <p>{{ $t("domain.bot.price_per_use") }}: <strong>
                    {{ pricePerUse }} SEED
                  </strong></p>
                </div>
                <div
                v-if="pricingModel === 'pay_per_month' || pricingModel === 'pay_per_use_or_month'">
                  <p>{{ $t("domain.bot.price_per_month") }}: <strong>
                    {{ pricePerMonth }} SEED
                  </strong></p>
                </div>

                <p>
                  {{ $t("domain.bot.category") }}:
                  {{ $t(`domain.bot_categories.${category}`) }}
                </p>
                <p>
                  {{ $t("bots.updated") }}
                  {{ updatedAt | toDate('short') }}
                </p>
                </div>
                <div class="col-md-2">
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                  @click="editBot()"
                  v-show="username === this.$store.getters.user.username && context == 'myProducts'"
                  >{{ $t('common.modify') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                  @click="subscribe()" v-show="!subscribed">{{ $t('bots.subscribe') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                  @click="subscribe()" v-show="subscribed">{{ $t('bots.configure') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                  @click="testBot()" v-show="subscribed">{{ $t('bots.test_bot') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                  @click="viewCode()" v-show="subscribed">{{ $t('bots.view_code') }}</button>
                  <button type="submit" class="btn btn-sm btn-danger btn-block mb-2"
                  @click="confirmUnsubscribe()"
                  v-show="subscribed && username !== this.$store.getters.user.username"
                  >{{ $t('bots.unsubscribe') }}</button>
                  <button type="submit" class="btn btn-sm btn-danger btn-block mb-2"
                  @click="confirmDelete()"
                  v-show="username === this.$store.getters.user.username && context == 'myProducts'"
                  >{{ $t('common.delete') }}</button>
                </div>
              </div>
              <div class="row view">
                <div class="col-md-3">
                  <div class="rating">
                    <star-rating :rating="3.5" :increment="0.5" :star-size="26"
                    :show-rating="false" :inline="true" :read-only="true"></star-rating>
                  </div>
                </div>
                <div class="col-md-9">

                  <ul class="nav nav-underline">
                    <li class="nav-item active">
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'description' }]">
                      <a class="nav-link" style="padding-left:0px"
                      @click="selectedTab='description'">{{ $t("domain.bot.description") }}</a>
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
                    <h2 class="view__subtitle">{{ $t("domain.bot.description") }}</h2>
                    <p>{{ description }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.bot.status") }}</h2>
                    <p>{{ $t(`domain.bot_statuses.${status}`) }}</p>
                  </div>


                  <div v-show="selectedTab === 'features'">
                    <h2 class="view__subtitle"></h2>
                    <p class="nl2br">{{ features }}</p>
                  </div>

                  <div v-show="selectedTab === 'license'">
                    <h2 class="view__subtitle"></h2>
                    <p class="nl2br">{{ license }}</p>
                  </div>

                </div>
              </div>

          </div>
        </div>
      </div>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';
import StarRating from 'vue-star-rating';
import PictureChanger from 'seed-theme/src/components/PictureChanger.vue';

export default {
  name: 'MarketplaceBotsView',
  components: {
    AppLayout,
    StarRating,
    PictureChanger,
  },
  props: ['context'],
  data() {
    return {
      subscribed: false,
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      selectedTab: 'description',
      category: 'general',
      name: '',
      description: '',
      features: '',
      license: '',
      pictureUrl: '',
      pricingModel: 'free',
      pricePerUse: '',
      pricePerMonth: '',
      status: 'enabled',
      picture: '',
      username: '',
      updatedAt: '',
      token: '',
      botengine: {},
      services: [],
      channels: [],
    };
  },
  created() {
    this.getData();
  },
  beforeDestroy() {
    this.removeHadron();
  },
  methods: {
    getHadronUrl(suffix) {
      return process.env.VUE_APP_HADRON_URL + suffix;
    },
    getRhizomeUrl(suffix) {
      return process.env.VUE_APP_RHIZOME_URL + suffix;
    },
    removeHadron() {
      if (typeof window.inToggle !== 'undefined') {
        window.inToggle.hideHadron();
      }
    },
    injectHadron() {
      if (typeof window.inToggle === 'undefined') {
        const script = document.createElement('script');
        script.onload = () => { };
        script.src = this.getHadronUrl('/launcher.bundle.js');
        document.head.appendChild(script);
      } else {
        window.inToggle.init();
      }
    },
    getData() {
      this.loading = true;
      this.axios.get(`/api/marketplace/bots/${this.$route.params.id}`)
        .then((result) => {
          this.loading = false;
          this.subscribed = result.data.subscribed;
          this.category = result.data.bot.category;
          this.name = result.data.bot.name;
          this.description = result.data.bot.description;
          this.features = result.data.bot.features;
          this.license = result.data.bot.license;
          this.pricingModel = result.data.bot.pricingModel;
          this.pricePerUse = result.data.bot.pricePerUse;
          this.pricePerMonth = result.data.bot.pricePerMonth;
          this.status = result.data.bot.status;
          this.picture = result.data.bot.picture;
          this.pictureUrl = result.data.bot.pictureUrl;
          this.username = result.data.bot.username;
          this.updatedAt = result.data.bot.updatedAt;
          this.botengine = result.data.bot.botEngine;
          this.services = result.data.bot.services;
          this.channels = result.data.bot.channels;
          this.$refs.pictureChanger.loadImage(
            this.pictureUrl,
            `${this.$route.params.id}.jpg`,
            `/api/bots/${this.$route.params.id}/change-picture`,
          );
          this.token = '';
          if (result.data.subscribed) {
            this.token = result.data.subscription.token;
          }
        })
        .catch(() => { // (error)
          this.loading = false;
          this.oops = true;
        });
    },
    editBot() {
      const { id } = this.$route.params;
      this.$router.push({ name: 'botsForm', params: { id } });
    },
    confirmDelete() {
      // const { id } = this.$route.params;
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('bots.delete_this_bot'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('common.delete'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true,
      })
        .then((value) => {
          if (value === true) {
            this.deleteBot();
          }
        })
        .catch(() => { // (err)
          this.oops = true;
        });
    },
    deleteBot() {
      this.validationErrors = [];
      this.deleting = true;
      this.deleted = false;
      const { id } = this.$route.params;
      this.axios.post('/api/bots/delete', {
        id,
      })
        .then(() => { // (result)
          this.deleting = false;
          this.deleted = true;
          switch (this.context) {
            case 'myProducts':
              this.$router.push({ name: 'botsList' });
              break;
            case 'marketplace':
              this.$router.push({ name: 'marketplaceBotsList' });
              break;
            default:
              // do nothing
          }
        })
        .catch((error) => {
          this.deleting = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
    subscribe() {
      const { id } = this.$route.params;
      switch (this.context) {
        case 'myProducts':
          this.$router.push({ name: 'BotsConfigure', params: { id } });
          break;
        case 'marketplace':
          this.$router.push({ name: 'marketplaceBotsConfigure', params: { id } });
          break;
        default:
          // do nothing
      }
    },
    testBot() {
      // const { id } = this.$route.params;
      this.removeHadron();
      this.injectHadron();
      // this.$router.push({ name: 'botsForm', params: { id } });
    },
    viewCode() {
      const { id } = this.$route.params;
      switch (this.context) {
        case 'myProducts':
          this.$router.push({ name: 'botsCode', params: { id } });
          break;
        case 'marketplace':
          this.$router.push({ name: 'marketplaceBotsCode', params: { id } });
          break;
        default:
          // do nothing
      }
    },
    confirmUnsubscribe() {
      // const { id } = this.$route.params;
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('bots.unsubscribe_from_this_bot'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('bots.unsubscribe'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true,
      })
        .then((value) => {
          if (value === true) {
            this.unsubscribe();
          }
        })
        .catch(() => { // (err)
          this.oops = true;
        });
    },
    unsubscribe() {
      this.validationErrors = [];
      this.deleting = true;
      this.deleted = false;
      const { id } = this.$route.params;
      this.axios.post(`/api/subscriptions/bots/${id}/unsubscribe`, {})
        .then(() => { // (result)
          this.deleting = false;
          this.deleted = true;
          switch (this.context) {
            case 'myProducts':
              this.$router.push({ name: 'botsList' });
              break;
            case 'marketplace':
              this.$router.push({ name: 'marketplaceBotsList' });
              break;
            default:
              // do nothing
          }
        })
        .catch((error) => {
          this.deleting = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
  },
  computed: {
    getBackUrl() {
      switch (this.context) {
        case 'myProducts':
          return { name: 'botsList' };
        case 'marketplace':
          return { name: 'marketplaceBotsList' };
        default:
          return {};
      }
    },
  },
};
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

.img-view {
  border-radius: 25px;
}
</style>
