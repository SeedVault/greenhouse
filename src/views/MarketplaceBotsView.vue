<template>
  <app-layout>
    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'marketplaceBotsList' }">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
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
                data-bot-title="SEED Bot"
                data-bot-external-css="https://hadron.botanic.io/sprout/sequoia_b.css"
                data-bot-launcher-external-css="https://hadron.botanic.io/sprout/sequoia-launcher_b.css"
                data-bot-load-font="Montserrat:300,400,600"
                data-bot-bbot-uri="https://rhizome.botanic.io/"
                :data-bot-publisher-token="token"
              ></span>
            </template>

            <div class="row row-form view" v-show="!deleting && !deleted">
              <div class="col-md-3">
                <img :src="pictureUrl" class="img-fluid img-view" />
              </div>

              <div class="col-md-7">
                <h1 class="view__title">{{ name }}</h1>
                <p>by <strong>{{ username }}</strong></p>

                <div v-if="pricingModel === 'free'">
                  <p>{{ $t("domain.bot.price") }}: <strong>
                  {{ $t('common.free') }}
                  </strong></p>
                </div>
                <div v-if="pricingModel === 'pay_per_use' || pricingModel === 'pay_per_use_or_month'">
                  <p>{{ $t("domain.bot.price_per_use") }}: <strong>
                    {{ pricePerUse }} SEED
                  </strong></p>
                </div>
                <div v-if="pricingModel === 'pay_per_month' || pricingModel === 'pay_per_use_or_month'">
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
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="subscribe()" v-show="!subscribed">{{ $t('bots.subscribe') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="subscribe()" v-show="subscribed">{{ $t('bots.configure') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="testBot()" v-show="subscribed">{{ $t('bots.test_bot') }}</button>
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="viewCode()" v-show="subscribed">{{ $t('bots.view_code') }}</button>
                  <button type="submit" class="btn btn-sm btn-danger btn-block mb-2" @click="confirmUnsubscribe()" v-show="subscribed">{{ $t('bots.unsubscribe') }}</button>
                </div>
              </div>
              <div class="row view">
                <div class="col-md-3">
                  <div class="rating">
                    <star-rating :rating="3.5" :increment="0.5" :star-size="26" :show-rating="false" :inline="true" :read-only="true"></star-rating>
                  </div>
                </div>
                <div class="col-md-9">

                  <ul class="nav nav-underline">
                    <li class="nav-item active">
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'description' }]">
                      <a class="nav-link" style="padding-left:0px" @click="selectedTab='description'">{{ $t("domain.bot.description") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'features' }]">
                      <a class="nav-link" @click="selectedTab='features'">{{ $t("domain.bot.features") }}</a>
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
import MyProducts from '@/views/MyProducts.vue';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';

export default {
  name: 'BotsView',
  components: {
    AppLayout,
    MyProducts,
    StarRating,
  },
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
    removeHadron() {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === 'https://hadron.botanic.io/launcher.bundle.js') {
          scripts[i].parentElement.removeChild(scripts[i]);
        }
      }
    },
    injectHadron() {
      const script = document.createElement('script');
      script.onload = () => { }
      script.src = 'https://hadron.botanic.io/launcher.bundle.js';
      document.head.appendChild(script);
    },
    getData() {
      this.loading = true;
      this.axios.get(`/api/markteplace/bots/${this.$route.params.id}`)
        .then((result) => {
          this.loading = false;
          this.subscribed = result.data.subscribed;
          this.category = result.data.bot.category;
          this.name = result.data.bot.name;
          this.description = result.data.bot.description;
          this.features = result.data.bot.features;
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
          this.token = '';
          if (result.data.subscribed) {
            this.token = result.data.subscription.token;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    subscribe() {
      const { id } = this.$route.params;
      this.$router.push({ name: 'marketplaceBotsForm', params: { id } });
    },
    testBot() {
      const { id } = this.$route.params;
      this.removeHadron();
      this.injectHadron();
      // this.$router.push({ name: 'botsForm', params: { id } });
    },
    viewCode() {
      const { id } = this.$route.params;
      this.$router.push({ name: 'marketplaceBotsCode', params: { id } });
    },
    confirmUnsubscribe() {
      const { id } = this.$route.params;
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
        .catch((err) => {
          this.oops = true;
        });
    },
    unsubscribe() {
      this.validationErrors = [];
      this.deleting = true;
      this.deleted = false;
      const { id } = this.$route.params;
      this.axios.post(`/api/subscriptions/bots/${id}/unsubscribe`, {})
        .then((result) => {
          this.deleting = false;
          this.deleted = true;
          this.$router.push({ name: 'marketplaceBotsList' });
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
