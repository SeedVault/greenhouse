<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'marketplaceBotsView', params: { id: this.id } }" v-show="!saving && !saved && !showComponentList && !showPropertiesForm">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <a class="nav-link back" :href="'#components'" @click="showPropertiesForm = false" v-show="!saving && !saved && showPropertiesForm">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </a>

            <div class="saving text-center" v-show="saving || saved">
              <div v-bind:class="[{ 'load-complete': saved }, 'circle-loader circle-text']">
                <div class="checkmark draw" v-show="saved"></div>
              </div>
              <div v-if="saving && !saved">
                {{ $t('common.please_wait') }}
              </div>
            </div>

            <div class="row row-form" v-show="!saving && !saved && !showComponentList && !showPropertiesForm">
              <div class="col-md-3">
                <h4 class="bot-title">{{ name }}</h4>
              </div>

              <div class="col-md-9">

                <validation-box id="_" :validationErrors="validationErrors"></validation-box>

                <form @submit.prevent="save" v-show="!saving">

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

                  <template v-if="visibleComponents.length > 0">
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <a name="components"></a>
                        <label><h5>{{ $t('products.components') }}</h5></label>
                        <ul class="list-group">
                          <template v-if="visibleComponents.includes(botengine.component)">
                            <li class="list-group-item">
                              <a style="cursor: pointer" @click="selectComponent(botengine.component, 'botengine', true)"><img class="component-logo-small" :src="cachedComponentPictureUrl(botengine.component)" /></a>
                              <a class="list-group-item-link" @click="selectComponent(botengine.component, 'botengine', true)">{{ cachedComponentName(botengine.component) }}</a>
                            </li>
                          </template>
                          <template v-if="services.length > 0">
                            <li v-for="service in services" :key="service._id" class="list-group-item" v-if="visibleComponents.includes(service.component)">
                              <img class="component-logo-small" :src="cachedComponentPictureUrl(service.component)" />
                              <a class="list-group-item-link" @click="selectComponent(service.component, 'service', true)">{{ cachedComponentName(service.component) }}</a>
                            </li>
                          </template>
                          <template v-if="channels.length > 0">
                            <li v-for="channel in channels" :key="channel._id" class="list-group-item" v-if="visibleComponents.includes(channel.component)">
                              <img class="component-logo-small" :src="cachedComponentPictureUrl(channel.component)" />
                              <a class="list-group-item-link" @click="selectComponent(channel.component, 'channel', true)">{{ cachedComponentName(channel.component) }}</a>
                            </li>
                        </template>
                        </ul>
                      </div>
                    </div>
                    <hr />
                  </template>

                  <div class="form-row">
                    <div class="form-group col-md-4 button-area">
                      <input type="submit" id="submit" :value="$t('common.save')"
                        class="btn btn-primary btn-lg btn-block"/>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            <div v-show="showPropertiesForm">
              <form @submit.prevent="savePropertiesForm">
                <div class="row row-form">
                  <div class="col-md-3">
                    <h4 class="component-title">{{ componentName }}</h4>
                  </div>
                  <div class="col-md-9">
                    <template v-if="componentType == 'service'">
                      <h5 class="mb-4">{{ $t("domain.component.headers") }}</h5>
                      <property-form :properties="headers" v-model="headersData" :propertiesData="headersData" valueType="publisher" :validationErrors="validationErrorsProperties"></property-form>
                      <h5 class="mb-4 mt-4">{{ $t("domain.component.predefinedVars") }}</h5>
                      <property-form :properties="predefinedVars" v-model="predefinedVarsData" :propertiesData="predefinedVarsData" valueType="publisher" :validationErrors="validationErrorsProperties"></property-form>
                      <h5 class="mb-4 mt-4">{{ $t("domain.component.mappedVars") }}</h5>
                      <property-form :properties="mappedVars" v-model="mappedVarsData" :propertiesData="mappedVarsData" valueType="publisher" :validationErrors="validationErrorsProperties"></property-form>
                    </template>
                    <template v-else>
                      <property-form :properties="properties" v-model="propertiesData" :propertiesData="propertiesData" valueType="publisher" :validationErrors="validationErrorsProperties"></property-form>
                    </template>
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
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';
import PropertyForm from '@/components/PropertyForm.vue';

export default {
  name: 'MarketplaceBotsForm',
  components: {
    AppLayout,
    StarRating,
    PropertyForm,
  },
  data() {
    return {
      id: '',
      loading: false,
      oops: false,
      saving: false,
      saved: false,

      subscriptionType: '',
      pricingOptions: [],

      category: 'general',
      botId: '',
      name: '',
      description: '',
      features: '',
      license: '',
      pricingModel: 'free',
      pricePerUse: '',
      pricePerMonth: '',
      status: 'enabled',
      botengine: {},
      services: [],
      channels: [],
      validationErrors: [],
      validationErrorsProperties: [],

      botengineSubscription: {},
      servicesSubscription: [],
      channelsSubscription: [],

      showComponentList: false,
      componentType: 'botengine',
      fetching: false,
      search: '',
      focusOnSearch: false,
      page: 1,
      sortBy: 'name',
      sortType: 'asc',
      components: [],
      pagesCount: 0,
      resultsCount: 0,

      showPropertiesForm: false,
      componentName: null,
      componentPricingModel: 'paid',
      componentPricePerMonth: 0,
      componentPricePerUser: 0,
      componentId: null,
      properties: [],
      propertiesData: [],
      headers: [],
      headersData: [],
      predefinedVars: [],
      predefinedVarsData: [],
      mappedVars: [],
      mappedVarsData: [],

      cachedComponents: [],
      visibleComponents: [],

      editMode: false,
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
      this.visibleComponents = [];
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
        } else {
          this.subscriptionType = this.pricingOptions[0].value;
        }
        this.botengine = result[0].data.bot.botEngine;
        this.botengineSubscription = result[0].data.subscription.botEngine;
        ids.push(this.botengine.component);
        delete (this.botengine._id);
        this.services = result[0].data.bot.services;
        this.servicesSubscription = result[0].data.subscription.services;
        for (let i = 0; i < this.services.length; i++) {
          ids.push(this.services[i].component);
          delete (this.services[i]._id);
        }
        this.channels = result[0].data.bot.channels;
        this.channelsSubscription = result[0].data.subscription.channels;
        for (let i = 0; i < this.channels.length; i++) {
          ids.push(this.channels[i].component);
          delete (this.channels[i]._id);
        }
        result[1] = await this.axios.get('/api/components/lookup', { params: { ids: ids.join(',') } });

        for (let i = 0; i < result[1].data.length; i++) {
          this.cachedComponents.set(result[1].data[i]._id, result[1].data[i]);
          if (result[1].data[i].hasPublisherProps) {
            this.visibleComponents.push(result[1].data[i]._id);
          }
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.oops = true;
      }
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
    save() {
      this.validationErrors = [];
      this.saving = true;
      this.saved = false;
      var botId = this.id;
      this.axios.post(`/api/subscriptions/bots/${botId}/subscribe`, {
        subscriptionType: this.subscriptionType,
        botengine: this.botengine,
        services: this.services,
        channels: this.channels,
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
    priceWithFormat(pricingModel, pricePerUse, pricePerMonth) {
      if (pricingModel === 'free') {
        return this.$i18n.t('common.free');
      } else {
        return `${pricePerUse} SEED/use or ${pricePerMonth} SEED/month`;
      }

    },
    findInputType(property) {
      let sControl = '';
      switch (property.inputType) {
        case 'text':
          sControl = 'PropertyInputText';
          break;
        case 'textarea':
          sControl = 'PropertyInputTextarea';
          break;
        case 'select':
          sControl = 'PropertyInputSelect';
          break;
      }
      return sControl;
    },
    selectComponent(componentId, cType, eMode) {
      this.validationErrorsProperties = [];
      this.editMode = eMode;
      this.fetching = true;
      this.showPropertiesForm = false;
      this.axios.get(`/api/components/${componentId}`)
        .then((result) => {
          this.fetching = false;
          this.cachedComponents.set(result.data._id, result.data);
          this.showPropertiesForm = true;
          this.componentId = result.data._id;
          this.componentName = result.data.name;
          this.componentType = result.data.componentType;
          this.componentPricingModel = result.data.pricingModel;
          this.componentPricePerMonth = result.data.pricePerMonth;
          this.componentPricePerUse = result.data.pricePerUse;
          this.properties = result.data.properties;
          let k = Object.keys(this.propertiesData);
          for (let j = 0; j < k.length; j++) {
            this.$delete(this.propertiesData, k[j]);
          }
          this.headers = result.data.headers;
          k = Object.keys(this.headersData);
          for (let j = 0; j < k.length; j++) {
            this.$delete(this.headersData, k[j]);
          }
          this.predefinedVars = result.data.predefinedVars;
          k = Object.keys(this.predefinedVarsData);
          for (let j = 0; j < k.length; j++) {
            this.$delete(this.predefinedVarsData, k[j]);
          }
          this.mappedVars = result.data.mappedVars;
          k = Object.keys(this.mappedVarsData);
          for (let j = 0; j < k.length; j++) {
            this.$delete(this.mappedVarsData, k[j]);
          }
          // Load current data
          this.currentData = [];
          switch (cType) {
            case 'botengine':
              if (this.botengine) {
                this.currentData = this.botengine.values;
                if (typeof this.botengineSubscription !== 'undefined') {
                  if (typeof this.botengineSubscription.values !== 'undefined') {
                    this.currentData = Object.assign({}, this.botengineSubscription.values);
                  }
                }
              }
              break;
            case 'service':
              for (let i = 0; i < this.services.length; i++) {
                if (this.services[i].component === componentId) {
                  this.currentData = Object.assign({}, this.services[i].values);
                  if (typeof this.servicesSubscription !== 'undefined') {
                    if (typeof this.servicesSubscription[i] !== 'undefined') {
                      if (typeof this.servicesSubscription[i].values !== 'undefined') {
                        this.currentData = Object.assign({}, this.servicesSubscription[i].values);
                      }
                    }
                  }
                  //this.subscriptionType = this.services[i].subscriptionType;
                  break;
                }
              }
              break;
            case 'channel':
              for (let i = 0; i < this.channels.length; i++) {
                if (this.channels[i].component === componentId) {
                  this.currentData = Object.assign({}, this.channels[i].values);
                  if (typeof this.channelsSubscription !== 'undefined') {
                    if (typeof this.channelsSubscription[i] !== 'undefined') {
                      if (typeof this.channelsSubscription[i].values !== 'undefined') {
                        this.currentData = Object.assign({}, this.channelsSubscription[i].values);
                      }
                    }
                  }
                  // this.subscriptionType = this.channels[i].subscriptionType;
                  break;
                }
              }
              break;
          }
          if (typeof this.currentData === 'undefined') {
            this.currentData = [];
          }
          const currentDataKeys = Object.keys(this.currentData);
          const currentDataValues = Object.values(this.currentData);
          // Set properties
          this.propertiesData = [];
          for (let i = 0; i < this.properties.length; i++) {
            const vKey = `_${this.properties[i]._id}`;
            let v = '';
            for (let j = 0; j < currentDataKeys.length; j++) {
              if (currentDataKeys[j] === vKey) {
                v = currentDataValues[j];
                break;
              }
            }
            this.$set(this.propertiesData, vKey, v);
            this.properties[i].value = v;
            this.properties[i].inputType = this.findInputType(this.properties[i]);
          }
          // Set headers
          this.headersData = [];
          for (let i = 0; i < this.headers.length; i++) {
            const vKey = `_${this.headers[i]._id}`;
            let v = '';
            for (let j = 0; j < currentDataKeys.length; j++) {
              if (currentDataKeys[j] === vKey) {
                v = currentDataValues[j];
                break;
              }
            }
            this.$set(this.headersData, vKey, v);
            this.headers[i].value = v;
            this.headers[i].inputType = this.findInputType(this.headers[i]);
          }
          // Set predefinedVars
          this.predefinedVarsData = [];
          for (let i = 0; i < this.predefinedVars.length; i++) {
            const vKey = `_${this.predefinedVars[i]._id}`;
            let v = '';
            for (let j = 0; j < currentDataKeys.length; j++) {
              if (currentDataKeys[j] === vKey) {
                v = currentDataValues[j];
                break;
              }
            }
            this.$set(this.predefinedVarsData, vKey, v);
            this.predefinedVars[i].value = v;
            this.predefinedVars[i].inputType = this.findInputType(this.predefinedVars[i]);
          }
          // Set mappedVars
          this.mappedVarsData = [];
          for (let i = 0; i < this.mappedVars.length; i++) {
            const vKey = `_${this.mappedVars[i]._id}`;
            let v = '';
            for (let j = 0; j < currentDataKeys.length; j++) {
              if (currentDataKeys[j] === vKey) {
                v = currentDataValues[j];
                break;
              }
            }
            this.$set(this.mappedVarsData, vKey, v);
            this.mappedVars[i].value = v;
            this.mappedVars[i].inputType = this.findInputType(this.mappedVars[i]);
          }
        })
        .catch((error) => {
          this.fetching = false;
          this.showPropertiesForm = false;
          this.oops = true;
        });
    },
    savePropertiesForm() {
      this.validationErrorsProperties = [];
      const c = {
        component: this.componentId,
        values: {},
      };
      let isValid = true;
      // check properties
      let k = Object.keys(this.propertiesData);
      let v = Object.values(this.propertiesData);
      for (let j = 0; j < k.length; j++) {
        c.values[k[j]] = v[j];
      }
      for (let i = 0; i < this.properties.length; i++) {
        if (this.properties[i].valueType === 'publisher' && this.properties[i].required === 'yes' && v[i].trim() === '') {
          const id = `_${this.properties[i]._id}`;
          this.validationErrorsProperties[id] = {
            err: {
              msg: 'validation.required',
            },
          };
          isValid = false;
        }
      }
      // check headers
      k = Object.keys(this.headersData);
      v = Object.values(this.headersData);
      for (let j = 0; j < k.length; j++) {
        c.values[k[j]] = v[j];
      }
      for (let i = 0; i < this.headers.length; i++) {
        if (this.headers[i].valueType === 'publisher' && this.headers[i].required === 'yes' && v[i].trim() === '') {
          const id = `_${this.headers[i]._id}`;
          this.validationErrorsProperties[id] = {
            err: {
              msg: 'validation.required',
            },
          };
          isValid = false;
        }
      }
      // check predefinedVars
      k = Object.keys(this.predefinedVarsData);
      v = Object.values(this.predefinedVarsData);
      for (let j = 0; j < k.length; j++) {
        c.values[k[j]] = v[j];
      }
      for (let i = 0; i < this.predefinedVars.length; i++) {
        if (this.predefinedVars[i].valueType === 'publisher' && this.predefinedVars[i].required === 'yes' && v[i].trim() === '') {
          const id = `_${this.predefinedVars[i]._id}`;
          this.validationErrorsProperties[id] = {
            err: {
              msg: 'validation.required',
            },
          };
          isValid = false;
        }
      }
      // check mappedVars
      k = Object.keys(this.mappedVarsData);
      v = Object.values(this.mappedVarsData);
      for (let j = 0; j < k.length; j++) {
        c.values[k[j]] = v[j];
      }
      for (let i = 0; i < this.mappedVars.length; i++) {
        if (this.mappedVars[i].valueType === 'publisher' && this.mappedVars[i].required === 'yes' && v[i].trim() === '') {
          const id = `_${this.mappedVars[i]._id}`;
          this.validationErrorsProperties[id] = {
            err: {
              msg: 'validation.required',
            },
          };
          isValid = false;
        }
      }
      // Show form
      if (isValid === false) {
        return;
      }
      this.showPropertiesForm = false;
      this.showComponentList = false;
      let found = false;
      switch (this.componentType) {
        case 'botengine':
          this.botengine = Object.assign({}, c);
          break;
        case 'service':
          for (let i = 0; i < this.services.length; i++) {
            if (this.services[i].component === c.component) {
              this.services[i].values = Object.assign({}, c.values);
              found = true;
              break;
            }
          }
          if (found === false) {
            this.services.push(Object.assign({}, c));
          }
          break;
        case 'channel':
          for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].component === c.component) {
              this.channels[i].values = Object.assign({}, c.values);
              found = true;
              break;
            }
          }
          if (found === false) {
            this.channels.push(Object.assign({}, c));
          }
          break;
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
  },
  computed: {
    ...mapGetters(['allBotCategories', 'allBotStatuses', 'allPricingModels']),
    botCategories() {
      const botCategoryList = [];
      for (let i = 0; i < this.allBotCategories.length; i++) {
        botCategoryList.push({
          value: this.allBotCategories[i],
          text: this.$i18n.t(`domain.bot_categories.${this.allBotCategories[i]}`),
        });
      }
      return botCategoryList;
    },
    botStatuses() {
      const botStatusList = [];
      for (let i = 0; i < this.allBotStatuses.length; i++) {
        botStatusList.push({
          value: this.allBotStatuses[i],
          text: this.$i18n.t(`domain.bot_statuses.${this.allBotStatuses[i]}`),
        });
      }
      return botStatusList;
    },
    pricingModels() {
      const pricingModelList = [];
      for (let i = 0; i < this.allPricingModels.length; i++) {
        pricingModelList.push({
          value: this.allPricingModels[i],
          text: this.$i18n.t(`domain.pricing_models.${this.allPricingModels[i]}`),
        });
      }
      return pricingModelList;
    },
    componentTypeContext() {
      return `#${this.componentType}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.saving {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

.smallButton {
  height: 32px;
}

.list {
  margin-top: 10px;
  color: #212529;

  &__empty {
    color: #686b77;
    font-size: 16px;
    text-align: center;
    margin: 5rem 0;
  }

  &__filter {
    text-decoration: none;
    margin-right: 40px;
    color: #686b77;

    &:hover {
      color: #6b4c9f;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    &.active {
      color: #6b4c9f;
      font-weight: bold;
    }
  }

  &__sorting {
    color: #686b77;
    text-align: right;
    font-size: 14px;
    margin-bottom: 3rem;
  }

  &__sort {
    text-decoration: none;
    margin-left: 15px;
    color: #686b77;

    &:hover {
      color: #6b4c9f;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    &.active {
      color: #6b4c9f;
      font-weight: bold;
    }
  }

  &__image {
    width: 104px;
    border-radius: 1rem !important;

    &:hover {
      cursor: pointer;
    }
  }

  &__name {
  color: #212529;
  font-size: 16px;
  font-weight: 500;
  }

  &__description {
    color: #686b77;
    font-size: 16px;
  }

  &__price {
    color: #686b77;
    font-size: 16px;
  }

  &__misc {
    margin-top: 10px;
    color: #a3a8b0;
  }

  &__rating {
    float: left;
  }

  &__category {
    height: 20px;
    line-height: 20px;
    vertical-align: text-bottom;
    float: left;
    padding-top: 4px;
    margin-left: 15px;
  }

  &__updated {
    height: 20px;
    line-height: 20px;
    vertical-align: text-bottom;
    float: left;
    padding-top: 4px;
    margin-left: 15px;
  }

  &__paginator {
    margin-top: 10px;

    &-text {
      color: #686b77;
      margin: 0 1em;
    }
  }
}

hr {
  border: none;
  border-top: 1px solid #f6f6f6;
  margin: 24px 0;
}


// search

.medium-size {
  padding: 0.1rem 1rem;
  height: 48px;
}

.search-button {
  padding: 0rem 0.75rem;
  background-color: #fff;

  &:hover {
    cursor: pointer;
  }
}

.search-button-focused {
  padding: 0rem 0.75rem;
  color: #fff;
  background-color: #6b4c9f ;
  border-color: #6b4c9f;

  &:hover {
    cursor: pointer;
  }
}

// Misc
h4.component-title {
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
