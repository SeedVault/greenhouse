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
                data-bot-voice-recognition-visible="true"
                data-bot-voice-recognition-continuous="true"
                data-bot-voice-recognition-stoplistening-command="stop listening"
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
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'properties' }]">
                      <a class="nav-link" @click="selectedTab='properties'"
                      >{{ $t("domain.bot.properties") }}</a>
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

                  <div v-show="selectedTab === 'properties'">
                    <div v-show="!showPropertyForm">
                      <h2 class="view__subtitle">{{ $t("domain.component.properties") }}</h2>
                      <div class="no_properties" v-show="properties.length === 0"
                      >{{ $t("properties.there_are_no_properties") }}</div>
                      <template v-if="!userIsOwner">
                      <ul>
                        <li v-for="property in properties" :key="property._id">
                          <span>{{ property.name }}</span>
                        </li>
                      </ul>
                      </template>
                      <template v-else>
                        <draggable v-model="properties" class="list-group" tag="ul"
                          v-bind="dragOptions" @start="drag = true" @end="drag = false"
                          @change="reorderProperties('properties')"
                          ghost-class="ghost" v-show="properties.length > 0">
                          <transition-group type="transition"
                          :name="!drag ? 'flip-list' : null">
                            <li class="list-group-item" v-for="property in properties"
                            :key="property._id">
                              <img style="margin-right: 10px;"
                              :src="require('@/assets/icons/outline-icon-drag-24px.svg')" />
                              <a class="list-group-item-link"
                              @click="modifyProperty(property, 'properties')"
                              >{{ property.name }}</a>
                              <a class="list-group-item-delete icon-hover"
                              @click="confirmDeleteProperty(property._id, 'properties')">
                                <img
                                :src="require('@/assets/icons/outline-icon-delete-24px.svg')"
                                 />
                              </a>
                            </li>
                          </transition-group>
                        </draggable>
                        <button type="submit"
                        class="btn btn-sm btn-primary mb-2 addNewButton smallButton"
                        @click="addProperty('properties')"
                        >+ {{ $t('properties.new_property') }}</button>
                      </template>
                    </div>


                                        <div class="propertyForm" v-show="showPropertyForm">
<validation-box id="_" :validationErrors="validationErrors"></validation-box>

                      <h2 class="view__subtitle mb-4">
                        {{ propertyName === ""? $t("properties.new_property"):
                        $t("properties.modify_property") }}</h2>

                      <div class="saving text-center" v-show="saving || saved">
                        <div
                        v-bind:class="[{ 'load-complete': saved }, 'circle-loader circle-text']">
                          <div class="checkmark draw" v-show="saved"></div>
                        </div>
                        <div v-if="saving && !saved">
                          {{ $t('common.please_wait') }}
                        </div>
                      </div>

                      <form @submit.prevent="saveProperty" v-show="!saving">
                        <div class="form-row">
                          <div class="form-group col-md-12">
                            <input-text id="name" v-model="propertyName"
                            :label="$t('domain.property.name')"
                              :placeholder="$t('domain.property.name_placeholder')"
                              icon="outline-icon-fingerprint-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                          <div class="form-group col-md-12">
                            <input-select id="valueType" v-model="propertyValueType"
                            :options="propertyValueTypes"
                              :label="$t('domain.property.value_type')"
                              icon="outline-icon-widgets-24px.svg"
                              :validationErrors="validationErrors"></input-select>
                          </div>
                          <div class="form-group col-md-12" v-show="propertyValueType !== 'fixed'">
                            <input-select id="inputType" v-model="propertyInputType"
                            :options="propertyInputTypes"
                              :label="$t('domain.property.input_type')"
                              icon="outline-icon-widgets-24px.svg"
                              :validationErrors="validationErrors"></input-select>
                          </div>
                          <div class="form-group col-md-12" v-show="propertyValueType !== 'fixed'
                          && propertyInputType === 'select'">
                            <input-text id="options" v-model="propertyOptions"
                            :label="$t('domain.property.options')"
                              :placeholder="$t('domain.property.options_placeholder')"
                              icon="outline-icon-list-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                          <div class="form-group col-md-12" v-show="propertyValueType !== 'fixed'">
                            <input-select id="required" v-model="propertyRequired"
                            :options="propertyRequiredOptions"
                              :label="$t('domain.property.required')"
                              icon="outline-icon-toggle-24px.svg"
                              :validationErrors="validationErrors"></input-select>
                          </div>
                          <div class="form-group col-md-12" v-show="propertyValueType === 'fixed'">
                            <input-text id="value" v-model="propertyValue"
                              :label="$t('domain.property.value')"
                              :placeholder="$t('domain.property.value_placeholder')"
                              icon="outline-icon-label-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                          <div class="form-group col-md-12">
                            <input-textarea id="tooltip" v-model="propertyTooltip"
                            :label="$t('domain.property.tooltip')" :rows="5"
                            :placeholder="$t('domain.property.tooltip_placeholder')"
                            icon="outline-help_outline-24px@2x.svg"
                              :validationErrors="validationErrors"></input-textarea>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-4 mt-2">
                            <input type="submit" id="submit" :value="$t('common.save')"
                              class="btn btn-lg btn-primary mr-2"/>
                            <input type="button" id="cancel" :value="$t('common.cancel')"
                              class="btn btn-lg btn-secondary" @click="cancelPropertyForm"/>
                          </div>
                        </div>
                      </form>
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
import PictureChanger from 'seed-theme/src/components/PictureChanger.vue';
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

export default {
  name: 'MarketplaceBotsView',
  components: {
    AppLayout,
    StarRating,
    PictureChanger,
    draggable,
  },
  props: ['context'],
  data() {
    return {
      subscribed: false,
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      saving: false,
      saved: false,
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
      validationErrors: [],

      properties: [],
      showPropertyForm: false,
      propertyId: '',
      propertyName: '',
      propertyValueType: 'fixed',
      propertyInputType: 'text',
      propertyOptions: '',
      propertyRequired: 'yes',
      propertyValue: '',
      propertyTooltip: '',

      drag: false,
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
          this.properties = result.data.bot.properties;
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
    addProperty() {
      this.saving = false;
      this.saved = false;
      this.propertyId = '';
      this.propertyName = '';
      this.propertyValueType = 'fixed';
      this.propertyInputType = 'text';
      this.propertyOptions = '';
      this.propertyRequired = 'yes';
      this.propertyValue = '';
      this.propertyTooltip = '';
      this.showPropertyForm = true;
    },
    modifyProperty(p) {
      this.saving = false;
      this.saved = false;
      this.propertyId = p._id;
      this.propertyName = p.name;
      this.propertyValueType = p.valueType;
      this.propertyInputType = p.inputType;
      this.propertyOptions = p.options;
      this.propertyRequired = p.required;
      this.propertyValue = p.value;
      this.propertyTooltip = p.tooltip;
      this.showPropertyForm = true;
    },
    saveProperty() {
      this.validationErrors = [];
      this.saving = true;
      this.saved = false;
      this.axios.post('/api/bots/property/save', {
        id: this.$route.params.id,
        propertyId: this.propertyId,
        propertyName: this.propertyName,
        propertyValueType: this.propertyValueType,
        propertyInputType: this.propertyInputType,
        propertyOptions: this.propertyOptions,
        propertyRequired: this.propertyRequired,
        propertyValue: this.propertyValue,
        propertyTooltip: this.propertyTooltip,
      })
        .then(() => { // (result)
          this.saving = false;
          this.saved = true;
          this.showPropertyForm = false;
          this.getData();
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
    cancelPropertyForm() {
      this.showPropertyForm = false;
    },
    confirmDeleteProperty(propertyId) {
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('properties.delete_this_property'),
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
            this.deleteProperty(propertyId);
          }
        })
        .catch(() => { // (err)
          this.oops = true;
        });
    },
    deleteProperty(propertyId) {
      const { id } = this.$route.params;
      this.axios.post('/api/bots/property/delete', {
        id,
        propertyId,
      })
        .then(() => { // (result)
          this.getData();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
    reorderProperties() {
      const newOrder = [];
      for (let i = 0; i < this.properties.length; i += 1) {
        newOrder.push(this.properties[i]._id);
      }

      const { id } = this.$route.params;
      this.axios.post('/api/bots/property/reorder', {
        id,
        propertyIds: newOrder.join(','),
      })
        .then(() => { // (result)
          // this.getData();
        })
        .catch((error) => {
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
    userIsOwner() {
      return this.username === this.$store.getters.user.username && this.context === 'myProducts';
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
</style>
