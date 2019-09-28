<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <div class="saving text-center" v-show="saving || saved">
              <div v-bind:class="[{ 'load-complete': saved }, 'circle-loader circle-text']">
                <div class="checkmark draw" v-show="saved"></div>
              </div>
              <div v-if="saving && !saved">
                {{ $t('common.please_wait') }}
              </div>
            </div>


            <div v-show="!saving && !saved">
              <form @submit.prevent="save">
                <div class="row row-form">
                  <div class="col-md-3">
                    <h4 class="bot-title">{{ name }}</h4>
                  </div>
                  <div class="col-md-9">
                    <input-select v-model="subscriptionType" :options="pricingOptions" id="subscriptionType" name="subscriptionType"
                        :label="$t('common.subscription_type')"
                        icon="outline-icon-types-24px.svg"
                        :validationErrors="validationErrors" class="mb-4"></input-select>
                    <hr class="mt-4 mb-4" />
                    <!-- <template v-if="componentType == 'service'">
                      <h5 class="mb-4">{{ $t("domain.component.headers") }}</h5>
                      <property-form :properties="headers" v-model="headersData" :propertiesData="headersData" valueType="developer" :validationErrors="validationErrorsProperties"></property-form>
                      <h5 class="mb-4 mt-4">{{ $t("domain.component.predefinedVars") }}</h5>
                      <property-form :properties="predefinedVars" v-model="predefinedVarsData" :propertiesData="predefinedVarsData" valueType="developer" :validationErrors="validationErrorsProperties"></property-form>
                      <h5 class="mb-4 mt-4">{{ $t("domain.component.mappedVars") }}</h5>
                      <property-form :properties="mappedVars" v-model="mappedVarsData" :propertiesData="mappedVarsData" valueType="developer" :validationErrors="validationErrorsProperties"></property-form>
                    </template>
                    <template v-else>
                      <property-form :properties="properties" v-model="propertiesData" :propertiesData="propertiesData" valueType="developer" :validationErrors="validationErrorsProperties"></property-form>
                    </template> -->
                    <div class="form-row">
                      <div class="form-group col-md-4 button-area">
                          <input type="submit" id="submitProperty" :value="$t('common.save')"
                            class="btn btn-primary btn-lg btn-block"/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
import PropertyForm from '@/components/PropertyForm.vue';

export default {
  name: 'MarketplaceBotsForm',
  components: {
    AppLayout,
    PropertyForm,
  },
  data() {
    return {
      id: '',
      loading: false,
      oops: false,
      saving: false,
      saved: false,

      subscribed: false,
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
      botengine: {},
      services: [],
      channels: [],

      subscriptionType: '',

      validationErrors: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/markteplace/bots/${this.$route.params.id}`)
        .then((result) => {
          this.loading = false;
          this.subscribed = result.data.subscribed;
          if (this.subscribed) {
            this.subscriptionType = result.data.subscription.subscriptionType;
          }
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
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    save() {
      this.validationErrors = [];
      /* this.saving = true;
      this.saved = false; */
    },
  },
  computed: {
    ...mapGetters(['allPricingModels']),
    pricingOptions() {
      const pricingOptionsList = [];
      console.log(this.pricingModel);
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
            `(${this.componentPricePerMonth} SEED)`
          });
        }
        if (this.pricingModel === 'pay_per_month' || this.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'use',
            text: this.$i18n.t('domain.component.price_per_use') +
            `(${this.componentPricePerUse} SEED)`
          });
        }
      }
      return pricingOptionsList;
    },
    isNew() {
      return (this.id === '');
    },
  }
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


