<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="urlToGoBack" v-show="!saving && !saved && !showComponentList && !showPropertiesForm">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <a class="nav-link back" :href="componentTypeContext" @click="showComponentList = false" v-show="!saving && !saved && showComponentList && !showPropertiesForm">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </a>

            <a class="nav-link back" @click="showPropertiesForm = false; showComponentList = true" v-show="showPropertiesForm">
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
                <h4><template v-if="isNew">{{ $t('bots.new_bot') }}</template>
                <template v-else>{{ $t('bots.modify_bot') }}</template>
                </h4>

              </div>

              <div class="col-md-9">

                <validation-box id="_" :validationErrors="validationErrors"></validation-box>

                <form @submit.prevent="save" v-show="!saving">

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-select v-model="category" :options="botCategories" id="category"
                        :label="$t('domain.bot.category')"
                        icon="outline-icon-types-24px.svg"
                        :validationErrors="validationErrors"></input-select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="name" id="name" :label="$t('domain.bot.name')"
                        :placeholder="$t('domain.bot.name_placeholder')" icon="outline-bot-icon-24.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="description" id="description" :label="$t('domain.bot.description')"
                        :placeholder="$t('domain.bot.description_placeholder')" icon="outline-icon-description-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input-text v-model="features" id="description" :label="$t('domain.bot.features')"
                        :placeholder="$t('domain.bot.description_placeholder')" icon="outline-icon-description-24px.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <input-text v-model="price" id="price" :label="$t('domain.bot.price')"
                        :placeholder="$t('domain.bot.price_placeholder')" icon="outline-coin-24px@2x.svg"
                        :validationErrors="validationErrors"></input-text>
                    </div>
                    <div class="form-group col-md-6">
                      <input-select v-model="status" :options="botStatuses" id="status"
                        :label="$t('domain.bot.status')"
                        icon="outline-icon-toggle-24px.svg"
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
                            <img class="component-logo-small" :src="cachedComponentPictureUrl(botengine.component)" />
                            <a class="list-group-item-link" @click="selectComponent(botengine.component, 'botengine')">{{ cachedComponentName(botengine.component) }}</a>
                            <a class="list-group-item-delete icon-hover" @click="confirmDeleteComponent(botengine.component, 'botengine')">
                              <img :src="require('@/assets/icons/outline-icon-delete-24px.svg')" />
                            </a>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <div class="no-component-selected">{{ $t('bots.there_are_no_bot_engines_selected') }}</div>
                      </template>
                    </div>
                    <div class="form-group col-md-6 text-right">
                      <a href="#" class="btn btn-sm btn-primary mb-2 smallButton" @click="componentList('botengine')">{{ $t('common.choose_from_list') }}</a>
                    </div>
                  </div>

                  <hr />

                  <div class="form-row">
                    <a name="service"></a>
                    <div class="form-group col-md-6">
                      <label><h5>{{ $t('domain.bot.services') }}</h5></label>
                      <template v-if="services.length > 0">
                        ​<ul class="list-group">
                          <li v-for="service in services" class="list-group-item">
                            <img class="component-logo-small" :src="cachedComponentPictureUrl(service.component)" />
                            <a class="list-group-item-link" @click="selectComponent(service.component, 'service')">{{ cachedComponentName(service.component) }}</a>
                            <a class="list-group-item-delete icon-hover" @click="confirmDeleteComponent(service.component, 'service')">
                              <img :src="require('@/assets/icons/outline-icon-delete-24px.svg')" />
                            </a>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <div class="no-component-selected">{{ $t('bots.there_are_no_services_selected') }}</div>
                      </template>
                    </div>
                    <div class="form-group col-md-6 text-right">
                      <a href="#" class="btn btn-sm btn-primary mb-2 smallButton" @click="componentList('service')">{{ $t('common.choose_from_list') }}</a>
                    </div>
                  </div>

                  <hr />

                  <div class="form-row">
                    <a name="channel"></a>
                    <div class="form-group col-md-6">
                      <label><h5>{{ $t('domain.bot.channels') }}</h5></label>
                      <template v-if="channels.length > 0">
                        <ul class="list-group">
                          <li v-for="channel in channels" class="list-group-item">
                            <img class="component-logo-small" :src="cachedComponentPictureUrl(channel.component)" />
                            <a class="list-group-item-link" @click="selectComponent(channel.component, 'channel')">{{ cachedComponentName(channel.component) }}</a>
                            <a class="list-group-item-delete icon-hover" @click="confirmDeleteComponent(channel.component, 'channel')">
                              <img :src="require('@/assets/icons/outline-icon-delete-24px.svg')" />
                            </a>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <div class="no-component-selected">{{ $t('bots.there_are_no_channels_selected') }}</div>
                      </template>
                    </div>
                    <div class="form-group col-md-6 text-right">
                      <a href="#" class="btn btn-sm btn-primary mb-2 smallButton" @click="componentList('channel')">{{ $t('common.choose_from_list') }}</a>
                    </div>
                  </div>

                  <hr />

                  <div class="form-row">
                    <div class="form-group col-md-4 button-area">
                      <input type="submit" id="submit" :value="$t('common.save')"
                        class="btn btn-primary btn-lg btn-block"/>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            <div class="row row-form" v-show="!saving && !saved && showComponentList && !showPropertiesForm">
              <div class="col-md-3">
                <h4 class="component-title">{{ $t(`bots.list_of_${componentType}`) }}</h4>
              </div>
              <div class="col-md-5"></div>
              <div class="col-md-4 mb-2">
                <div class="input-group">
                  <input type="text" v-model="search" class="form-control medium-size" :placeholder="$t('common.search')"
                  v-on:keydown.enter.prevent="doSearch" @blur="searchBlur" @focus="searchFocus">
                  <div class="input-group-append">
                    <span v-bind:class="{'input-group-text': true, 'search-button': !focusOnSearch, 'search-button-focused': focusOnSearch }" @click.prevent="doSearch">
                      <template v-if="focusOnSearch">
                        <img :src="require('@/assets/icons/outline-search-white-24px.svg')" />
                      </template>
                      <template v-else>
                        <img :src="require('@/assets/icons/outline-search-24px.svg')" />
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="list" v-show="!fetching && showComponentList && !showPropertiesForm">
              <hr>
              <div class="row">
                <div class="col-6">
                </div>
                <div class="col-6 list__sorting">
                  {{ $t('common.sort_by') }}:
                  <a @click="setSortBy('name')" v-bind:class="{'list__sort': true, 'active': sortBy === 'name' }" href="#">{{ $t('domain.component.name') }}</a>
                  <a @click="setSortBy('updatedAt')" v-bind:class="{'list__sort': true, 'active': sortBy === 'updatedAt' }" href="#">{{ $t('common.date') }}</a>
                  <a @click="toggleSortType()" class="list__sort icon-hover">
                    <template v-if="sortType === 'desc'">
                      <img :src="require('@/assets/icons/outline-sort-desc-24px.svg')" />
                    </template>
                    <template v-else>
                      <img :src="require('@/assets/icons/outline-sort-asc-24px.svg')" />
                    </template>
                  </a>
                </div>
              </div>
              <div class="list__empty" v-show="!fetching & components.length === 0">
                {{ $t('components.there_are_no_components') }}
              </div>
              <div v-for="(component, index) in components" :key="index">
                <div class="row">
                  <div class="col-sm">
                    <div class="media">
                      <img :src="component.pictureUrl" class="list__image mr-4">
                      <div class="media-body list-body mb-2">
                        <h5 class="list__name mt-0">{{ component.name }}</h5>
                        <div class="list__description">{{ component.description }}</div>
                        <div class="list__misc clearfix">
                          <div class="list__rating">
                          <star-rating :rating="3.5" :increment="0.5" :star-size="18" :show-rating="false" :inline="true" :read-only="true"></star-rating>
                          </div>
                          <div class="list__category">{{ $t("domain.component.category") }}:
                          {{ $t(`domain.component_categories.${component.category}`) }}
                          </div>
                          <div class="list__updated">{{ $t("components.updated") }}
                          {{ component.updatedAt | toDate('short') }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-2 align-self-center text-right">
                    <div class="list__price">
                      {{ priceWithFormat(component.price) }}
                    </div>
                  </div>
                  <div class="col-sm-2 align-self-center">
                    <button class="btn btn-sm btn-primary btn-block mb-2" @click="selectComponent(component._id, componentType)">{{ $t('common.get') }}</button>
                  </div>
                </div>
                <hr >
              </div>
              <div class="row">
                <div class="col-sm text-center">
                  <div class="list__paginator" v-show="pagesCount > 1">
                    <a @click="jumpToPage(page - 1)" v-show="page - 1 > 0" :title="$t('common.go_to_previous_page')" class="icon-hover">
                      <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" />
                    </a>
                    <span class="list__paginator-text">{{ $t('common.page') }} {{ page }}</span>
                    <a @click="jumpToPage(page + 1)" v-show="page + 1 <= pagesCount" :title="$t('common.go_to_next_page')" class="icon-hover">
                      <img :src="require('@/assets/icons/outline-icon-forward-24px.svg')" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="fetching text-center" v-show="fetching && showComponentList">
              <div v-bind:class="[{ 'load-complete': !fetching }, 'circle-loader circle-text']">
              </div>
              <div v-if="fetching">
                {{ $t('common.please_wait') }}
              </div>
            </div>

            <div v-show="showPropertiesForm">
              <form @submit.prevent="savePropertiesForm">
                <div class="row row-form">
                  <div class="col-md-3">
                    <h4 class="component-title">{{ componentName }}</h4>
                  </div>
                  <div class="col-md-9">
                    <property-form :properties="properties" v-model="propertiesData" :validationErrors="validationErrors"></property-form>
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
import PropertyForm from '@/components/PropertyForm.vue';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';

export default {
  name: 'BotsForm',
  components: {
    AppLayout,
    StarRating,
    PropertyForm
  },
  data() {
    return {
      id: '',
      loading: false,
      oops: false,
      saving: false,
      saved: false,
      category: 'general',
      name: '',
      description: '',
      features: '',
      price: '',
      status: 'enabled',
      botengine: {},
      services: [],
      channels: [],
      validationErrors: [],

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
      componentId: null,
      properties: [],
      propertiesData: [],

      cachedComponents: []
    };
  },
  created() {
    this.cachedComponents = new Map();
    if (typeof this.$route.params.id === 'undefined') {
      this.id = '';
    } else {
      this.id = this.$route.params.id;
      this.getData();
    }
  },
  methods: {
    getData() {
      this.cachedComponents = new Map();
      this.loading = true;
      this.axios.get(`/api/bots/${this.id}`)
        .then((result) => {
          let ids = [];
          this.category = result.data.category;
          this.name = result.data.name;
          this.description = result.data.description;
          this.features = result.data.features;
          this.price = result.data.price;
          this.status = result.data.status;
          this.picture = result.data.picture;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
          this.botengine = result.data.botEngine;
          ids.push(this.botengine.component);
          delete(this.botengine['_id']);
          this.services = result.data.services;
          for (let i = 0; i < this.services.length; i++) {
            ids.push(this.services[i].component);
            delete(this.services[i]['_id']);
          }
          this.channels = result.data.channels;
          for (let i = 0; i < this.channels.length; i++) {
            ids.push(this.channels[i].component);
            delete(this.channels[i]['_id']);
          }
          this.getCachedComponents(ids);
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    getCachedComponents(ids) {
      this.axios.get(`/api/components/lookup`, { params: { ids: ids.join(',') } })
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
      this.axios.post('/api/bots/save', {
        id: this.id,
        category: this.category,
        name: this.name,
        description: this.description,
        features: this.features,
        price: this.price,
        status: this.status,
        botengine: this.botengine,
        services: this.services,
        channels: this.channels
      })
        .then((result) => {
          let id = result.data.id;
          this.saving = false;
          this.saved = true;
          this.$router.push({ name: 'botsView', params: { id } });
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
    componentList(componentTypeFilter) {
      this.validationErrors = [];
      this.showComponentList = true;
      this.componentType = componentTypeFilter;
      this.search = '';
      this.page = 1;
      this.sortBy =  'name';
      this.sortType = 'asc';
      this.getComponents();
    },
    doSearch() {
      this.page = 1;
      this.getComponents();
    },
    searchFocus() {
      this.focusOnSearch = true;
    },
    searchBlur() {
      this.focusOnSearch = false;
    },
    setSortBy(column) {
      this.sortBy = column;
      this.doSearch();
    },
    toggleSortType() {
      this.sortType = (this.sortType === 'asc'? 'desc': 'asc');
      this.doSearch();
    },
    jumpToPage(pageNumber) {
      this.page = pageNumber;
      this.getComponents();
    },
    getComponents() {
      this.fetching = true;
      this.components = [];
      this.axios.get('/api/components', { params: {
        page: this.page,
        componentType: this.componentType,
        search: this.search,
        status: 'enabled',
        sortBy: this.sortBy,
        sortType: this.sortType
      } } )
        .then((results) => {
          this.fetching = false;
          this.pagesCount = results.data.pagesCount;
          this.resultsCount = results.data.resultsCount;
          this.components = results.data.results;
        })
        .catch((error) => {
          this.fetching = false;
          this.oops = true;
        });
    },
    priceWithFormat(price) {
      if (price === 0) {
        return this.$i18n.t('common.free');
      } else {
        return `${price} SEED`;
      }
    },
    selectComponent(componentId, cType) {
      this.fetching = true;
      this.showPropertiesForm = false;
      this.axios.get('/api/components/' + componentId)
        .then((result) => {
          this.fetching = false;
          this.cachedComponents.set(result.data._id, result.data);
          this.showPropertiesForm = true;
          this.componentId = result.data._id;
          this.componentName = result.data.name;
          this.properties = result.data.properties;
          const k = Object.keys(this.propertiesData);
          for (let j = 0; j < k.length; j++) {
            this.$delete(this.propertiesData, k[j]);
          }
          this.propertiesData = [];
          for (let i = 0; i < this.properties.length; i++) {
            this.$set(this.propertiesData, `_${this.properties[i]._id}`, '');
            if (this.properties[i].inputType === 'text') {
              this.properties[i].inputType = 'PropertyInputText';
            }
            if (this.properties[i].inputType === 'select') {
              this.properties[i].inputType = 'PropertyInputSelect';
            }
          }
        })
        .catch((error) => {
          this.fetching = false;
          this.showPropertiesForm = false;
          this.oops = true;
        });
    },
    savePropertiesForm() {
      this.showPropertiesForm = false;
      let k = Object.keys(this.propertiesData);
      let v = Object.values(this.propertiesData);
      let c = {
        component: this.componentId,
        values: {}
      };
      for (let j = 0; j < k.length; j++) {
        c.values[k[j]] = v[j];
      }
      this.showComponentList = false;
      let found = false;
      switch(this.componentType) {
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
      } else {
        return componentId;
      }
    },
    cachedComponentPictureUrl(componentId) {
      if (this.cachedComponents.has(componentId)) {
        return this.cachedComponents.get(componentId).pictureUrl;
      } else {
        return componentId;
      }
    },
    confirmDeleteComponent(componentId, cType) {
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('components.delete_this_component'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('common.delete'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true
      })
        .then(value => {
          if (value === true) {
            switch(cType) {
              case 'botengine':
                this.botengine = {};
                break;
              case 'service':
                for (let i = 0; i < this.services.length; i++) {
                  if (this.services[i].component === componentId) {
                    this.services.splice(i, 1);
                    break;
                  }
                }
                break;
              case 'channel':
                for (let i = 0; i < this.channels.length; i++) {
                  if (this.channels[i].component === componentId) {
                    this.channels.splice(i, 1);
                    break;
                  }
                }
                break;
            }
          }
        })
        .catch(err => {
          this.oops = true;
        })
    },
  },
  computed: {
    ...mapGetters(['allBotCategories', 'allBotStatuses']),
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
    isNew() {
      return (this.id === '');
    },
    urlToGoBack() {
      if (this.isNew) {
        return { name: 'botsList' };
      } else {
        return { name: 'botsView', params: { id: this.id }};
      }
    },
    componentTypeContext() {
      return `#${this.componentType}`;
    },
  }
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
