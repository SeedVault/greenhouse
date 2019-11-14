<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="getBackUrl">
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
                  {{ $t("domain.component.category") }}:
                  {{ $t(`domain.component_categories.${category}`) }}
                </p>
                <p>
                  {{ $t("components.updated") }}
                  {{ updatedAt | toDate('short') }}
                </p>
                </div>
                <div class="col-md-2">
                  <!-- <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="editComponent()">{{ $t('common.modify') }}</button>
                  <button type="submit" class="btn btn-sm btn-danger btn-block mb-2" @click="confirmDelete()">{{ $t('common.delete') }}</button> -->
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
                      <a class="nav-link" style="padding-left:0px" @click="selectedTab='description'">{{ $t("domain.component.description") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'features' }]">
                      <a class="nav-link" @click="selectedTab='features'">{{ $t("domain.component.features") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'license' }]">
                      <a class="nav-link" @click="selectedTab='license'">{{ $t("domain.component.license") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'properties' }]">
                      <a class="nav-link" @click="selectedTab='properties'">{{ $t("domain.component.properties") }} ({{ propertiesCount }})</a>
                    </li>
                  </ul>

                  <div v-show="selectedTab === 'description'">
                    <h2 class="view__subtitle">{{ $t("domain.component.description") }}</h2>
                    <p class="nl2br">{{ description }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.url") }}</h2>
                    <p><a :href="url" target="_blank">{{ url }}</a></p>

                    <h2 class="view__subtitle">{{ $t("domain.component.key") }}</h2>
                    <p>{{ key }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.function_name") }}</h2>
                    <p>{{ functionName }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.status") }}</h2>
                    <p>{{ $t(`domain.component_statuses.${status}`) }}</p>
                  </div>

                  <div v-show="selectedTab === 'features'">
                    <h2 class="view__subtitle"></h2>
                    <p class="nl2br">{{ features }}</p>
                  </div>

                  <div v-show="selectedTab === 'license'">
                    <h2 class="view__subtitle"></h2>
                    <p class="nl2br">{{ license }}</p>
                  </div>


                  <div v-show="selectedTab === 'properties'">
                    <div v-show="!showPropertyForm && componentType !== 'service'">
                      <h2 class="view__subtitle">{{ $t("domain.component.properties") }}</h2>
                      <div class="no_properties" v-show="properties.length === 0">{{ $t("properties.there_are_no_properties") }}</div>
                      <ul>
                        <li v-for="property in properties" :key="property._id">
                          <span>{{ property.name }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-show="!showPropertyForm && componentType === 'service'">
                      <h2 class="view__subtitle">{{ $t("domain.component.headers") }}</h2>
                      <div class="no_properties" v-show="headers.length === 0">{{ $t("properties.there_are_no_properties") }}</div>
                      <ul>
                        <li v-for="property in headers" :key="property._id">
                          <span>{{ property.name }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-show="!showPropertyForm && componentType === 'service'">
                      <h2 class="view__subtitle">{{ $t("domain.component.predefinedVars") }}</h2>
                      <div class="no_properties" v-show="predefinedVars.length === 0">{{ $t("properties.there_are_no_properties") }}</div>
                      <ul>
                        <li v-for="property in predefinedVars" :key="property._id">
                          <span>{{ property.name }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-show="!showPropertyForm && componentType === 'service'">
                      <h2 class="view__subtitle">{{ $t("domain.component.mappedVars") }}</h2>
                      <div class="no_properties" v-show="mappedVars.length === 0">{{ $t("properties.there_are_no_properties") }}</div>
                       <ul>
                        <li v-for="property in mappedVars" :key="property._id">
                          <span>{{ property.name }}</span>
                        </li>
                      </ul>
                    </div>

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
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

export default {
  name: 'MarketplaceComponentsView',
  components: {
    AppLayout,
    StarRating,
    draggable,
  },
  props: ['context'],
  data() {
    return {
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      saving: false,
      saved: false,
      selectedTab: 'description',
      componentType: 'service',
      category: 'general',
      name: '',
      description: '',
      features: '',
      license: '',
      key: '',
      functionName: '',
      url: '',
      httpMethod: 'GET',
      timeout: 30,
      pictureUrl: '',
      pricingModel: 'free',
      pricePerUse: '',
      pricePerMonth: '',
      status: 'enabled',
      picture: '',
      properties: [],
      headers: [],
      predefinedVars: [],
      mappedVars: [],
      username: '',
      updatedAt: '',
      validationErrors: [],

      showPropertyForm: false,
      propertyGroup: '',
      propertyId: '',
      propertyName: '',
      propertyValueType: 'fixed',
      propertyInputType: 'text',
      propertyOptions: '',
      propertyRequired: 'yes',
      propertyValue: '',

      drag: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/components/${this.$route.params.id}`)
        .then((result) => {
          this.loading = false;
          this.componentType = result.data.componentType;
          this.category = result.data.category;
          this.name = result.data.name;
          this.description = result.data.description;
          this.features = result.data.features;
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
          this.properties = result.data.properties;
          this.headers = result.data.headers;
          this.predefinedVars = result.data.predefinedVars;
          this.mappedVars = result.data.mappedVars;
          this.pictureUrl = result.data.pictureUrl;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    reorderProperties(propertyGroup) {
    },
  },
  computed: {
    ...mapGetters(['allPropertyValueTypes', 'allPropertyInputTypes']),
    propertyValueTypes() {
      const inputTypeList = [];
      for (let i = 0; i < this.allPropertyValueTypes.length; i += 1) {
        inputTypeList.push({
          value: this.allPropertyValueTypes[i],
          text: this.$i18n.t(`domain.property_value_types.${this.allPropertyValueTypes[i]}`),
        });
      }
      return inputTypeList;
    },
    propertyInputTypes() {
      const inputTypeList = [];
      for (let i = 0; i < this.allPropertyInputTypes.length; i += 1) {
        inputTypeList.push({
          value: this.allPropertyInputTypes[i],
          text: this.$i18n.t(`domain.property_input_types.${this.allPropertyInputTypes[i]}`),
        });
      }
      return inputTypeList;
    },
    propertyRequiredOptions() {
      return [
        { value: 'yes', text: this.$i18n.t('common.yes') },
        { value: 'no', text: this.$i18n.t('common.no') },
      ];
    },
    propertiesCount() {
      if (this.componentType === 'service') {
        return this.headers.length + this.predefinedVars.length + this.mappedVars.length;
      }
      return this.properties.length;
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    getBackUrl() {
      switch (this.context) {
        case 'components':
          return { name: 'marketplaceComponentsList' };
          break;
        case 'services':
          return { name: 'marketplaceServicesList' };
          break;
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

.no_properties {
  color: #686b77;
  font-size: 16px;
  text-align: left;
  margin-top: 2rem;
}

.propertyForm {
  margin-top: 2rem;
}

// Drag
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #f6f6f6;
}

.list-group {
  margin-top: 1rem;
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

/* a.list-group-item-link {
  // color: #6b4c9f;
  cursor: pointer;
  &:hover {
    // color: #6b4c9f;
    // text-decoration: underline;
  }
}

a.list-group-item-delete {
  float: right;
  // color: #6b4c9f;
  cursor: pointer;
  &:hover {
    // color: #6b4c9f;
    // text-decoration: underline;
  }
} */

.img-view {
  border-radius: 25px;
}
</style>
