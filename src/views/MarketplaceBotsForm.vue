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


            <div class="row row-form" v-show="!saving && !saved">
              <div class="col-md-3">
                <h4 class="bot-title">{{ name }}</h4>
              </div>
              <div class="col-md-9">

                <validation-box id="_" :validationErrors="validationErrors"></validation-box>

                <form @submit.prevent="save">

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label :for="subscriptionType">{{ $t('domain.component.pricing_model') }}</label>
                      <select v-model="subscriptionType" class="input-with-icon form-control" id="subscriptionType" name="subscriptionType">
                        <option v-for="option in pricingOptions" :key="option.value" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                      <icon-inside-input icon="outline-icon-types-24px.svg"></icon-inside-input>
                    </div>
                  </div>

                  <hr />

                  <!-- <div class="form-row">
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
                  </div> -->

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

      pricingOptions: [],
      validationErrors: [],

      cachedComponents: [],

    };
  },
  created() {
    this.cachedComponents = new Map();
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      let result = [];
      try {
        result[0] = await this.axios.get(`/api/markteplace/bots/${this.id}`);
        const ids = [];
        this.name          = result[0].data.bot.name;
        this.pricingModel  = result[0].data.bot.pricingModel;
        this.pricePerUse   = result[0].data.bot.pricePerUse;
        this.pricePerMonth = result[0].data.bot.pricePerMonth;
        this.pricingOptions = [];
        if (this.pricingModel === 'free') {
          this.pricingOptions.push({
            value: 'free',
            text: this.$i18n.t('domain.pricing_models.free')
          });
        } else {
          if (this.pricingModel === 'pay_per_use' || this.pricingModel === 'pay_per_use_or_month') {
            this.pricingOptions.push({
              value: 'month',
              text: this.$i18n.t(`domain.component.price_per_month`) +
              `(${this.pricePerMonth} SEED)`
            });
          }
          if (this.pricingModel === 'pay_per_month' || this.pricingModel === 'pay_per_use_or_month') {
            this.pricingOptions.push({
              value: 'use',
              text: this.$i18n.t('domain.component.price_per_use') +
              `(${this.pricePerUse} SEED)`
            });
          }
        }
        this.subscribed = result[0].data.subscribed;
        if (this.subscribed === true) {
          this.subscriptionType = result[0].data.subscription.subscriptionType;
        }
        this.botengine = result[0].data.bot.botEngine;
        ids.push(this.botengine.component);
        delete (this.botengine._id);
        this.services = result[0].data.bot.services;
        for (let i = 0; i < this.services.length; i++) {
          ids.push(this.services[i].component);
          delete (this.services[i]._id);
        }
        this.channels = result[0].data.bot.channels;
        for (let i = 0; i < this.channels.length; i++) {
          ids.push(this.channels[i].component);
          delete (this.channels[i]._id);
        }
        result[1] = await this.axios.get('/api/components/lookup', { params: { ids: ids.join(',') } });
        for (let i = 0; i < result[1].data.length; i++) {
          this.cachedComponents.set(result[1].data[i]._id, result[1].data[i]);
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.oops = true;
      }
    },
    cachedComponentName(componentId) {
      if (this.cachedComponents.has(componentId)) {
        return this.cachedComponents.get(componentId).name;
      }
      return componentId;
    },
    cachedComponentPictureUrl(componentId) {
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
          console.log(error);
          this.saving = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
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

.no-component-selected {
  padding: 2rem 0;
  color: #495057;
}

.list-group {
  margin-top: 1rem;
  min-height: 20px;
}

.list-group-item i {
  cursor: pointer;
}

a.list-group-item-link {
  color: #6b4c9f;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    color: #6b4c9f;
    text-decoration: underline;
  }
}

a.list-group-item-delete {
  float: right;
  color: #6b4c9f;
  cursor: pointer;
  &:hover {
    color: #6b4c9f;
    text-decoration: underline;
  }
}

.component-logo-small {
  margin-right: 15px;
  vertical-align: middle;
  width: 26px;
  border-radius: 5px;
}

</style>
