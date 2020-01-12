<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <simple-box v-show="showPropertyForm">
        <property-form
          :property="property"
          :title="propertyFormTitle"
          @cancel-property-from="closePropertyForm()"
          @save-property="saveProperty()">
        </property-form>
      </simple-box>

      <simple-box v-if="showComponentList" >
        <a class="back" @click.prevent="closeChooseComponent()">
          <icon icon="chevron-left" />
          {{ $t('common.back') }}</a>
        <h4 class="my-4">{{ configSelectTitle }}</h4>
        <hr />
        <component-list
          screen="select"
          :services-only = "false"
          :component-type="configComponentType"
          @component-selected="configureComponent"
        ></component-list>
      </simple-box>

      <simple-box v-if="showConfigForm">
        <a class="back" @click.prevent="closeConfigForm()">
          <icon icon="chevron-left" />
          {{ $t('common.back') }}</a>
        <config-form
          :config="configForDeveloper"
          :values="configValues"
          @save-config="saveConfig"
        ></config-form>
      </simple-box>

      <back-box :to="urlToGoBack()" v-if="!saving && !saved && !loading
        && !oops && !showPropertyForm && !showComponentList && !showConfigForm">

        <full-centered v-slot:main v-if="saving || saved">
          <loading-checkmark visible="false" :loading="saving" showCheckmark="saved" >
          </loading-checkmark>
        </full-centered>

        <div class="row row-form" v-show="!saving && !saved && !showComponentList">
          <div class="col-md-3">
            <h4><template v-if="isNew()">{{ $t('bots.new_bot') }}</template>
            <template v-else>{{ $t('bots.modify_bot') }}</template></h4>
          </div>

          <div class="col-md-9">

              <validation-box id="_" :validationErrors="validationErrors"></validation-box>

              <form @submit.prevent="save" v-show="!saving">

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-select v-model="bot.category"
                    :options="botCategories()" id="category"
                    :label="$t('domain.bot.category')"
                    icon="types"
                    :validationErrors="validationErrors"></input-select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="bot.botId" id="botId"
                  :label="$t('domain.bot.bot_id')"
                  :placeholder="$t('domain.bot.bot_id_placeholder')"
                  icon="fingerprint"
                  :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="bot.name" id="name"
                    :label="$t('domain.bot.name')"
                    :placeholder="$t('domain.bot.name_placeholder')"
                    icon="bot"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="bot.description" id="description"
                    :label="$t('domain.bot.description')"
                    :placeholder="$t('domain.bot.description_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-textarea v-model="bot.features" id="features"
                    :label="$t('domain.bot.features')" :rows="5"
                    :placeholder="$t('domain.bot.features_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-textarea v-model="bot.license" id="license"
                    :label="$t('domain.bot.license')"
                    :tooltip="$t('domain.bot.license_tooltip')" :rows="5"
                    :placeholder="$t('domain.bot.license_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-4">
                  <input-select v-model="bot.pricingModel"
                    :options="pricingModels()" id="pricingModel"
                    :tooltip="$t('domain.bot.pricing_model_tooltip')"
                    :label="$t('domain.bot.pricing_model')"
                    icon="types"
                    :validationErrors="validationErrors"></input-select>
                </div>
                <div class="form-group col-md-4">
                  <input-text v-show="bot.pricingModel==='pay_per_use'
                    || bot.pricingModel==='pay_per_use_or_month'"
                    v-model="bot.pricePerUse"
                    id="pricePerUse" :label="$t('domain.bot.price_per_use')"
                    :placeholder="$t('domain.bot.price_per_use')"
                    icon="coin"
                    :validationErrors="validationErrors"></input-text>
                </div>
                <div class="form-group col-md-4">
                  <input-text
                    v-show="bot.pricingModel==='pay_per_month'
                    || bot.pricingModel==='pay_per_use_or_month'"
                    v-model="bot.pricePerMonth" id="pricePerMonth"
                    :label="$t('domain.bot.price_per_month')"
                    :placeholder="$t('domain.bot.price_per_month')"
                    icon="coin"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-4">
                  <input-select v-model="bot.status" id="status"
                    :options="botStatuses()"
                    :label="$t('domain.bot.status')"
                    icon="toggle"
                    :validationErrors="validationErrors"></input-select>
                </div>
                <div class="form-group col-md-8">
                </div>
              </div>

              <!-- Properties -->
             <hr class="mb-4" />
              <property-list
                :collection="bot.properties"
                collection-name = "properties"
                :title="$t('domain.bot.properties')"
                :empty-message="$t('bots.there_are_no_properties')"
                :title-add-new="$t('bots.new_property')"
                :title-edit="$t('bots.edit_property')"
                :title-delete="$t('bots.delete_this_property')"
                @new-property="newProperty"
                @edit-property="editProperty"
                @delete-property="deleteProperty">
              </property-list>

              <hr class="mt-5 mb-4" />

              <!-- Bot Engine -->
              <config-list
                :collection="bot.botengine"
                collection-name = "botengine"
                component-type = "botengine"
                :select-title="$t('bots.select_a_bot_engine')"
                :title="$t('domain.bot.bot_engine')"
                :empty-message="$t('bots.there_are_no_bot_engines_selected')"
                :title-delete="$t('domain.bot.delete_this_bot_engine')"
                :tooltip="$t('domain.bot.bot_engine_tooltip')"
                :cache="cachedComponents"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />

              <!-- Services -->
              <config-list
                :collection="bot.services"
                collection-name = "services"
                component-type = "service"
                :select-title="$t('bots.select_a_service')"
                :title="$t('domain.bot.services')"
                :empty-message="$t('bots.there_are_no_services_selected')"
                :title-delete="$t('domain.bot.delete_this_service')"
                :tooltip="$t('domain.bot.services_tooltip')"
                :cache="cachedComponents"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />

              <!-- Channels -->
              <config-list
                :collection="bot.channels"
                collection-name = "channels"
                component-type = "channel"
                :select-title="$t('bots.select_a_channel')"
                :title="$t('domain.bot.channels')"
                :empty-message="$t('bots.there_are_no_channels_selected')"
                :title-delete="$t('domain.bot.delete_this_channel')"
                :tooltip="$t('domain.bot.channels_tooltip')"
                :cache="cachedComponents"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />

              <div class="form-row mt-4">
                <div class="form-group col-md-4 button-area">
                  <input type="submit" id="submit" :value="$t('common.save')"
                    class="btn btn-primary btn-lg btn-block font-weight-bold"/>
                </div>
              </div>

            </form>

          </div>
        </div>

       </back-box>
    </template>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';
import { reactive, toRefs } from '@vue/composition-api';
import ConfigList from '@/components/ConfigList.vue';
import ComponentList from '@/components/ComponentList.vue';
import PropertyList from '@/components/PropertyList.vue';
import PropertyForm from '@/components/PropertyForm.vue';
import ConfigForm from '@/components/ConfigForm.vue';

export default {
  name: 'BotsForm',
  components: {
    AppPage,
    ConfigList,
    ComponentList,
    PropertyList,
    PropertyForm,
    ConfigForm,
  },
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      saving: false,
      saved: false,
      urlToGoBack: '',
      id: '',
      bot: {
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
        botengine: [], // {},
        services: [],
        channels: [],
        properties: [],
      },
      property: {},
      propertyFormTitle: '',
      propertyCollectionName: '',
      propertyCollectionIndex: -1,
      showPropertyForm: false,
      configCollectionName: '',
      configCollectionIndex: -1,
      configSelectTitle: '',
      configComponentType: 'service',
      configForDeveloper: {
        properties: {},
      },
      configValues: {
        subscriptionType: '',
      },
      showConfigForm: false,
      showComponentList: false,
      validationErrors: [],
      cachedComponents: new Map(),
    });

    if (typeof context.root.$route.params.id === 'undefined') {
      data.id = '';
    } else {
      data.id = context.root.$route.params.id;
    }

    function isNew() {
      return (data.id === '');
    }

    function urlToGoBack() {
      if (isNew()) {
        return {
          name: 'usersBots',
          params: { username: context.root.$route.params.username },
        };
      }
      return { name: 'usersBotsView', params: { id: data.id } };
    }


    function botCategories() {
      const botCategoryList = [];
      const { allBotCategories } = context.root.$store.getters;
      for (let i = 0; i < allBotCategories.length; i += 1) {
        botCategoryList.push({
          value: allBotCategories[i],
          text: context.root.$i18n.t(`domain.bot_categories.${allBotCategories[i]}`),
        });
      }
      return botCategoryList;
    }


    function botStatuses() {
      const botStatusList = [];
      const { allBotStatuses } = context.root.$store.getters;
      for (let i = 0; i < allBotStatuses.length; i += 1) {
        botStatusList.push({
          value: allBotStatuses[i],
          text: context.root.$i18n.t(`domain.bot_statuses.${allBotStatuses[i]}`),
        });
      }
      return botStatusList;
    }


    function pricingModels() {
      const pricingModelList = [];
      const { allPricingModels } = context.root.$store.getters;
      for (let i = 0; i < allPricingModels.length; i += 1) {
        pricingModelList.push({
          value: allPricingModels[i],
          text: context.root.$i18n.t(`domain.pricing_models.${allPricingModels[i]}`),
        });
      }
      return pricingModelList;
    }

    function httpMethods() {
      const httpMethodsList = [];
      const { allHttpMethods } = context.root.$store.getters;
      for (let i = 0; i < allHttpMethods.length; i += 1) {
        httpMethodsList.push({
          value: allHttpMethods[i],
          text: allHttpMethods[i],
        });
      }
      return httpMethodsList;
    }

    function displayPropertyForm() {
      data.showPropertyForm = true;
      data.scrollPosition = document.getElementById(data.propertyCollectionName).offsetTop;
      window.scrollTo(0, 0);
    }

    function newProperty(event) {
      data.propertyFormTitle = event.propertyFormTitle;
      data.propertyCollectionName = event.propertyCollectionName;
      data.propertyCollectionIndex = -1;
      data.property = {
        _id: '',
        name: '',
        valueType: 'fixed',
        inputType: 'text',
        options: '',
        required: 'yes',
        value: '',
        tooltip: '',
      };
      displayPropertyForm();
    }

    function editProperty(event) {
      data.propertyFormTitle = event.propertyFormTitle;
      data.propertyCollectionName = event.propertyCollectionName;
      data.propertyCollectionIndex = event.propertyCollectionIndex;
      data.property = data.bot[data.propertyCollectionName][data.propertyCollectionIndex];
      displayPropertyForm();
    }

    function deleteProperty(event) {
      data.bot[event.propertyCollectionName].splice(event.propertyCollectionIndex, 1);
    }

    function closePropertyForm() {
      data.showPropertyForm = false;
      setTimeout(() => {
        document.getElementById(data.propertyCollectionName).scrollIntoView();
      }, 100);
    }

    function saveProperty() {
      if (data.propertyCollectionIndex === -1) {
        data.bot[data.propertyCollectionName].push(data.property);
      } else {
        data.bot[data.propertyCollectionName][data.propertyCollectionIndex] = data.property;
      }
      closePropertyForm();
    }

    function chooseComponent() {
      data.showComponentList = true;
      data.scrollPosition = document.getElementById(data.configCollectionName).offsetTop;
      window.scrollTo(0, 0);
    }

    function newConfig(event) {
      data.configCollectionName = event.configCollectionName;
      data.configCollectionIndex = -1;
      data.configSelectTitle = event.configSelectTitle;
      data.configComponentType = event.configComponentType;
      chooseComponent();
    }

    function closeChooseComponent() {
      data.showComponentList = false;
      if (data.showConfigForm === false) {
        setTimeout(() => {
          document.getElementById(data.configCollectionName).scrollIntoView();
        }, 100);
      }
    }

    async function getPropertiesForValueType(id, valueType) {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/components/${id}/properties/${valueType}`);
        data.loading = false;
        return response.data;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
      return false;
    }

    async function configureComponent(event) {
      data.configForDeveloper = await getPropertiesForValueType(event.id, 'developer');
      data.cachedComponents.set(data.configForDeveloper._id, data.configForDeveloper);
      data.configValues = {
        component: data.configForDeveloper._id,
        subscriptionType: '',
        values: new Map(),
      };
      switch (data.configForDeveloper.pricingModel) {
        case 'free':
          data.configValues.subscriptionType = 'free';
          break;
        case 'pay_per_use':
          data.configValues.subscriptionType = 'use';
          break;
        case 'pay_per_month':
          data.configValues.subscriptionType = 'month';
          break;
        case 'pay_per_use_or_month':
          data.configValues.subscriptionType = 'month';
          break;
        default:
          // do nothing
      }
      let current = null;
      if (data.configCollectionIndex !== -1) {
        current = data.bot[data.configCollectionName][data.configCollectionIndex];
        if (typeof current.values === 'undefined') {
          current.values = new Map();
        }
      }
      const collectionNames = ['properties', 'headers', 'predefinedVars', 'mappedVars'];
      for (let i = 0; i < collectionNames.length; i++) {
        const collectionName = collectionNames[i];
        for (let j = 0; j < data.configForDeveloper[collectionName].length; j++) {
          const property = data.configForDeveloper[collectionName][j];
          data.configValues.values.set(property._id, property.value);
          if (data.configCollectionIndex !== -1) {
            if (current.values.has(property._id)) {
              data.configValues.values.set(property._id, current.values.get(property._id));
            }
          }
        }
      }
      data.showConfigForm = true;
      closeChooseComponent();
    }

    function editConfig(event) {
      data.configCollectionName = event.configCollectionName;
      data.configCollectionIndex = event.configCollectionIndex;
      data.configComponentType = event.configComponentType;
      const id = data.bot[data.configCollectionName][data.configCollectionIndex].component;
      data.scrollPosition = document.getElementById(data.configCollectionName).offsetTop;
      window.scrollTo(0, 0);
      configureComponent({ id });
    }

    function closeConfigForm() {
      data.showConfigForm = false;
      setTimeout(() => {
        document.getElementById(data.configCollectionName).scrollIntoView();
      }, 100);
    }

    function saveConfig(event) {
      data.showConfigForm = false;
      if (data.configCollectionIndex === -1) {
        data.bot[data.configCollectionName].push(event.values);
      } else {
        data.bot[data.configCollectionName][data.configCollectionIndex] = event.values;
      }
      closeConfigForm();
    }

    function deleteConfig(event) {
      data.bot[event.configCollectionName].splice(event.configCollectionIndex, 1);
    }

    async function getBot() {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/bots/${data.id}`);
        data.bot = response.data;
        data.bot.botengine = [data.bot.botEngine];
        // Create array of component ids to load them into cache
        const ids = [];
        const collectionNames = ['botengine', 'services', 'channels'];
        for (let i = 0; i < collectionNames.length; i++) {
          const c = collectionNames[i];
          for (let j = 0; j < data.bot[c].length; j++) {
            ids.push(data.bot[c][j].component);
            // Convert object to Maps
            if (typeof data.bot[c][j].values === 'undefined') {
              data.bot[c][j].values = new Map();
            } else {
              const mapData = new Map();
              const keys = Object.keys(data.bot[c][j].values);
              for (let k = 0; k < keys.length; k++) {
                mapData.set(keys[k], data.bot[c][j].values[keys[k]]);
              }
              data.bot[c][j].values = mapData;
            }
          }
        }
        const results = await context.root.axios.get('/components/lookup', { params: { ids: ids.join(',') } });
        for (let i = 0; i < results.data.length; i++) {
          data.cachedComponents.set(results.data[i]._id, results.data[i]);
        }
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    async function save() {
      try {
        data.validationErrors = [];
        data.saving = true;
        data.saved = false;
        // Fix serialization for javascript maps
        const botData = Object.assign({}, data.bot);
        const collectionNames = ['botengine', 'services', 'channels'];
        for (let i = 0; i < collectionNames.length; i++) {
          const c = collectionNames[i];
          for (let j = 0; j < botData[c].length; j++) {
            botData[c][j].values = JSON.stringify([...botData[c][j].values]);
          }
        }
        const results = await context.root.axios.post('/bots/save', {
          bot: botData,
        });
        data.saving = false;
        data.saved = true;
        const { id } = results.data;
        context.root.$router.push({ name: 'usersBotsView', params: { id } });
      } catch (error) {
        data.saving = false;
        if (error.response.status === 422) {
          data.validationErrors = context.root.normalizeErrors(error.response);
        } else {
          data.oops = true;
        }
      }
    }

    if (data.id !== '') {
      getBot();
    }

    return {
      ...toRefs(data),
      isNew,
      urlToGoBack,
      botCategories,
      botStatuses,
      pricingModels,
      httpMethods,
      saveProperty,
      closePropertyForm,
      newProperty,
      editProperty,
      deleteProperty,
      saveConfig,
      newConfig,
      editConfig,
      deleteConfig,
      chooseComponent,
      closeChooseComponent,
      configureComponent,
      closeConfigForm,
      save,
    };
  },
};
</script>

<style lang="scss" scoped>
hr {
  border: none;
  border-top: 1px solid #f6f6f6;
}
</style>
