<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="urlToGoBack">
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
                <template v-if="isSeedUser">
                  <h4><template v-if="isNew">{{ $t('components.new_component') }}</template>
                  <template v-else>{{ $t('components.modify_component') }}</template>
                  </h4>
                </template>
                <template v-else>
                  <h4><template v-if="isNew">{{ $t('services.new_service') }}</template>
                  <template v-else>{{ $t('services.modify_service') }}</template>
                  </h4>
                </template>

              </div>
              <div class="col-md-9">

                <validation-box id="_" :validationErrors="validationErrors"></validation-box>

                <form @submit.prevent="save" v-show="!saving">

                  <div class="form-row">
                    <div class="form-group col-md-12" v-if="isSeedUser">
                      <input-select v-model="componentType" :options="componentTypes" id="componentType"
                        :label="$t('domain.component.component_type')"
                        icon="outline-my-products-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-select v-model="category" :options="componentCategories" id="category"
                        :label="$t('domain.component.category')"
                        icon="outline-icon-types-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="name" id="name" :label="$t('domain.component.name')"
                        :placeholder="$t('domain.component.name_placeholder')" icon="outline-component-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="description" id="description" :label="$t('domain.component.description')"
                        :placeholder="$t('domain.component.description_placeholder')" icon="outline-icon-description-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-textarea v-model="license" id="license" :label="$t('domain.component.license')" :rows="5"
                        :placeholder="$t('domain.component.license_placeholder')" icon="outline-icon-description-24px.svg"
                        :validationErrors="validationErrors"></input-textarea>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="url" id="url" :label="$t('domain.component.url')"
                        :placeholder="$t('domain.component.url_placeholder')" icon="outline-icon-url-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-4">
                      <input-select v-model="httpMethod" :options="httpMethods" id="httpMethod"
                        :label="$t('domain.component.http_method')"
                        icon="outline-icon-list-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                    <div class="form-group col-md-4">
                      <input-text v-model="timeout" id="timeout" :label="$t('domain.component.timeout')"
                        :placeholder="$t('domain.component.timeout')" icon="outline-history-24px@2x.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="key" id="key" :label="$t('domain.component.key')"
                        :placeholder="$t('domain.component.key_placeholder')" icon="outline-icon-code-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-4">
                      <input-select v-model="pricingModel" :options="pricingModels" id="pricingModel"
                        :label="$t('domain.component.pricing_model')"
                        icon="outline-icon-types-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                    <div class="form-group col-md-4">
                      <input-text v-show="pricingModel==='pay_per_use' || pricingModel==='pay_per_use_or_month'" v-model="pricePerUse" id="pricePerUse" :label="$t('domain.bot.price_per_use')"
                        :placeholder="$t('domain.component.price_per_use')" icon="outline-coin-24px@2x.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                    <div class="form-group col-md-4">
                      <input-text v-show="pricingModel==='pay_per_month' || pricingModel==='pay_per_use_or_month'" v-model="pricePerMonth" id="pricePerMonth" :label="$t('domain.bot.price_per_month')"
                        :placeholder="$t('domain.component.price_per_month')" icon="outline-coin-24px@2x.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-8">
                      <input-text v-model="functionName" id="functionName" :label="$t('domain.component.function_name')"
                        :placeholder="$t('domain.component.function_name_placeholder')" icon="outline-icon-function-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>

                    <div class="form-group col-md-4">
                      <input-select v-model="status" :options="componentStatuses" id="status"
                        :label="$t('domain.component.status')"
                        icon="outline-icon-toggle-24px.svg"
                        :validationErrors="validationErrors"></input-select>
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

export default {
  name: 'ComponentsForm',
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
      componentType: 'service',
      category: 'general',
      name: '',
      description: '',
      license: '',
      key: '',
      functionName: '',
      url: '',
      httpMethod: 'GET',
      timeout: '30',
      pricingModel: 'free',
      pricePerUse: '',
      pricePerMonth: '',

      status: 'enabled',
      validationErrors: [],
    };
  },
  created() {
    if (typeof this.$route.params.id === 'undefined') {
      this.id = '';
    } else {
      this.id = this.$route.params.id;
      this.getData();
    }
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/components/${this.id}`)
        .then((result) => {
          this.loading = false;
          this.componentType = result.data.componentType;
          this.category = result.data.category;
          this.name = result.data.name;
          this.description = result.data.description;
          this.license = result.data.license;
          this.key = result.data.key;
          this.functionName = result.data.functionName;
          this.url = result.data.url;
          this.httpMethod = result.data.httpMethod;
          this.timeout = result.data.timeout;
          this.pricingModel = result.data.pricingModel;
          this.pricePerUse = result.data.pricePerUse;
          this.pricePerMonth = result.data.pricePerMonth;
          this.status = result.data.status;
          this.picture = result.data.picture;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
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
      switch(this.pricingModel) {
        case 'free':
          this.pricePerUse = '0';
          this.pricePerMonth = '0';
          break;
        case 'pay_per_use':
          this.pricePerMonth = '0';
          break;
        case 'pay_per_month':
          this.pricePerUse = '0';
          break;
      }
      this.axios.post('/api/components/save', {
        id: this.id,
        componentType: this.componentType,
        category: this.category,
        name: this.name,
        description: this.description,
        license: this.license,
        key: this.key,
        functionName: this.functionName,
        url: this.url,
        httpMethod: this.httpMethod,
        timeout: this.timeout,
        pricingModel: this.pricingModel,
        pricePerUse: this.pricePerUse,
        pricePerMonth: this.pricePerMonth,
        status: this.status,
      })
        .then((result) => {
          const { id } = result.data;
          this.saving = false;
          this.saved = true;
          this.$router.push({ name: 'componentsView', params: { id } });
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
    ...mapGetters(['allComponentTypes', 'allComponentCategories', 'allComponentStatuses', 'allPricingModels', 'allHttpMethods']),
    componentTypes() {
      const componentTypeList = [];
      for (let i = 0; i < this.allComponentTypes.length; i++) {
        componentTypeList.push({
          value: this.allComponentTypes[i],
          text: this.$i18n.t(`domain.component_types.${this.allComponentTypes[i]}`),
        });
      }
      return componentTypeList;
    },
    componentCategories() {
      const componentCategoryList = [];
      for (let i = 0; i < this.allComponentCategories.length; i++) {
        componentCategoryList.push({
          value: this.allComponentCategories[i],
          text: this.$i18n.t(`domain.component_categories.${this.allComponentCategories[i]}`),
        });
      }
      return componentCategoryList;
    },
    componentStatuses() {
      const componentStatusList = [];
      for (let i = 0; i < this.allComponentStatuses.length; i++) {
        componentStatusList.push({
          value: this.allComponentStatuses[i],
          text: this.$i18n.t(`domain.component_statuses.${this.allComponentStatuses[i]}`),
        });
      }
      return componentStatusList;
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
    httpMethods() {
      const httpMethodsList = [];
      for (let i = 0; i < this.allHttpMethods.length; i++) {
        httpMethodsList.push({
          value: this.allHttpMethods[i],
          text: this.allHttpMethods[i],
        });
      }
      return httpMethodsList;
    },
    isNew() {
      return (this.id === '');
    },
    isSeedUser() {
      return this.$store.getters.user.email === SEED_USER_EMAIL;
    },
    urlToGoBack() {
      if (this.isNew) {
        return { name: 'componentsList' };
      }
      return { name: 'componentsView', params: { id: this.id } };
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

</style>
