<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'marketplaceBotsView', params: { id: this.id } }">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <div class="saving text-center" v-show="saving || saved">
              <div v-bind:class="[{ 'load-complete': saved }, 'circle-loader circle-text']">
                <div class="checkmark draw" v-show="saved"></div>
              </div>
              <div v-if="saving && !saved">
                {{ $t('common.please_wait') }}
              </div>
            </div>


            <div class="row row-form" v-show="!saving && !saved && showSubscriptionForm ">
              <div class="col-md-3">
                <h4 class="bot-title">{{ name }}</h4>
              </div>
              <div class="col-md-9">

                <validation-box id="_" :validationErrors="validationErrors"></validation-box>

                <form @submit.prevent="save">

                  <h5 style="color: red">Value: {{ subscriptionType }}</h5>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-select v-model="subscriptionType" :options="pricingOptions" id="subscriptionType" name="subscriptionType"
                        :label="$t('domain.component.pricing_model')"
                        :placeholder="$t('domain.component.name_placeholder')"
                        icon="outline-icon-types-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                  </div>

                  <hr />
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <a name="botengine"></a>
                      <label><h5>{{ $t('domain.bot.bot_engine') }}</h5></label>
                      <template v-if="botengine.component">
                        <ul class="list-group">
                          <li class="list-group-item">
                            <a style="cursor: pointer" @click="selectComponent(botengine.component, 'botengine', true)"><img class="component-logo-small" :src="cachedComponentPictureUrl(botengine.component)" /></a>
                            <a class="list-group-item-link" @click="selectComponent(botengine.component, 'botengine', true)">{{ cachedComponentName(botengine.component) }}</a>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <div class="no-component-selected">{{ $t('bots.there_are_no_bot_engines_selected') }}</div>
                      </template>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-4 button-area">
                      <input type="submit" id="submit" :value="$t('common.save')"
                        class="btn btn-primary btn-lg btn-block"/>
                    </div>
                  </div>

                </form>
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
import { mapGetters } from 'vuex';
import { scrypt } from 'crypto';

export default {
  name: 'MarketplaceBotsForm',
  components: {
    AppLayout,
  },
  data() {
    return {
      id: '',
      loading: false,
      oops: false,
      saving: false,
      saved: false,

      name: '',
      suscribed: false,
      subscriptionType: '',

      pricingModel: '',
      pricePerUse: '',
      pricePerMonth: '',
      botengine: {},
      services: [],
      channels: [],

      validationErrors: [],

      cachedComponents: [],

      showSubscriptionForm: false,
    };
  },
  created() {
    this.cachedComponents = new Map();
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/markteplace/bots/${this.id}`)
        .then((result) => {
          const ids = [];
          this.loading = false;
          this.name          = result.data.bot.name;
          this.pricingModel  = result.data.bot.pricingModel;
          this.pricePerUse   = result.data.bot.pricePerUse;
          this.pricePerMonth = result.data.bot.pricePerMonth;
          this.subscribed = result.data.subscribed;
          if (this.subscribed === true) {
            this.subscriptionType = result.data.subscription.subscriptionType;
          } else {
            // this.subscriptionType = this.pricingOptions[0].value;
            this.subscriptionType = '';
          }
          this.botengine = result.data.bot.botEngine;
          ids.push(this.botengine.component);
          delete (this.botengine._id);
          this.services = result.data.bot.services;
          for (let i = 0; i < this.services.length; i++) {
            ids.push(this.services[i].component);
            delete (this.services[i]._id);
          }
          this.channels = result.data.bot.channels;
          for (let i = 0; i < this.channels.length; i++) {
            ids.push(this.channels[i].component);
            delete (this.channels[i]._id);
          }
          this.getCachedComponents(ids);
          this.showSubscriptionForm = true;
          if (this.subscribed === true) {
            this.subscriptionType = result.data.subscription.subscriptionType;
          } else {
            this.subscriptionType = this.pricingOptions[0].value;
            // this.subscriptionType = '';
          }
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    getCachedComponents(ids) {
      this.axios.get('/api/components/lookup', { params: { ids: ids.join(',') } })
        .then((results) => {
          for (let i = 0; i < results.data.length; i++) {
            this.cachedComponents.set(results.data[i]._id, results.data[i]);
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    cachedComponentName(componentId) {
      if (this.cachedComponents.has(componentId)) {
        return this.cachedComponents.get(componentId).name;
      }
      return componentId;
    },
    cachedComponentPictureUrl(componentId) {
      console.log(this.cachedComponents.has(componentId));
      if (this.cachedComponents.has(componentId)) {
        return this.cachedComponents.get(componentId).pictureUrl;
      }
      return componentId;
    },
    save() {
      this.validationErrors = [];
      this.saving = true;
      this.saved = false;
      var botId = this.id;
      this.axios.post(`/api/subscriptions/bots/${botId}/subscribe`, {
        subscriptionType: this.subscriptionType,
      })
        .then((result) => {
          // const { id } = result.data;
          this.saving = false;
          this.saved = true;
          this.$router.push({ name: 'marketplaceBotsView', params: { botId } });
        })
        .catch((error) => {
          this.saving = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
  },
  computed: {
    pricingOptions() {
      const pricingOptionsList = [{value: '', text: 'select'}];
      if (this.pricingModel === 'free') {
        pricingOptionsList.push({
          value: 'free',
          text: this.$i18n.t('domain.pricing_models.free')
        });
      } else {
        if (this.pricingModel === 'pay_per_use' || this.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'month',
            text: this.$i18n.t(`domain.component.price_per_month`) +
            `(${this.pricePerMonth} SEED)`
          });
        }
        if (this.pricingModel === 'pay_per_month' || this.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'use',
            text: this.$i18n.t('domain.component.price_per_use') +
            `(${this.pricePerUse} SEED)`
          });
        }
      }
      console.log(this.subscriptionType);
      console.log(pricingOptionsList);
      return pricingOptionsList;
    },
  },
}
</script>

<style lang="scss" scoped>
.saving {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

// Misc
h4.bot-title {
  margin-bottom: 0;
  font-weight: 500;
  line-height: 2;
}
</style>
