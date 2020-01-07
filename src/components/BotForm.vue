<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <simple-box v-show="showPropertyForm">
        <property-form :property="property"
          :title="propertyFormTitle"
          @cancel-property-from="closePropertyForm()"
          @save-property="saveProperty()">
        </property-form>
      </simple-box>

      <simple-box v-show="showComponentList" >
        <a class="back" @click.prevent="showComponentList = false">
          <icon icon="chevron-left" />
          {{ $t('common.back') }}</a>
        <h3 class="mt-4">Select your Bot Engine</h3>
        <hr />
        <component-list :services-only="false" screen="choose"></component-list>
      </simple-box>

      <back-box :to="urlToGoBack()" v-show="!saving && !saved && !loading
        && !oops && !showPropertyForm && !showComponentList">

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
              <property-list :collection="bot.properties"
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
              <config-list :collection="bot.botengine"
                collection-name = "botengine"
                :title="$t('domain.bot.bot_engine')"
                :empty-message="$t('bots.there_are_no_bot_engines_selected')"
                :title-delete="$t('domain.bot.delete_this_bot_engine')"
                :tooltip="$t('domain.bot.bot_engine_tooltip')"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />

              <!-- Services -->
              <config-list :collection="bot.services"
                collection-name = "services"
                :title="$t('domain.bot.services')"
                :empty-message="$t('bots.there_are_no_services_selected')"
                :title-delete="$t('domain.bot.delete_this_service')"
                :tooltip="$t('domain.bot.services_tooltip')"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />

              <!-- Channels -->
              <config-list :collection="bot.channels"
                collection-name = "channels"
                :title="$t('domain.bot.channels')"
                :empty-message="$t('bots.there_are_no_channels_selected')"
                :title-delete="$t('domain.bot.delete_this_channel')"
                :tooltip="$t('domain.bot.channels_tooltip')"
                @new-config="newConfig"
                @edit-config="editConfig"
                @delete-config="deleteConfig">
              </config-list>

              <hr class="mt-5 mb-4" />
<!--
              <template v-else>
                <a name="headers"></a>
                <property-list :collection="component.headers"
                  collection-name = "headers"
                  :title="$t('domain.component.headers')"
                  :empty-message="$t('components.there_are_no_headers')"
                  :title-add-new="$t('components.new_header')"
                  :title-edit="$t('components.edit_header')"
                  :title-delete="$t('components.delete_this_header')"
                  @new-property="newProperty"
                  @edit-property="editProperty"
                  @delete-property="deleteProperty">
                </property-list>
                <hr class="mt-5 mb-4" />
                <property-list :collection="component.predefinedVars"
                  collection-name = "predefinedVars"
                  :title="$t('domain.component.predefinedVars')"
                  :empty-message="$t('components.there_are_no_predefined_vars')"
                  :title-add-new="$t('components.new_predefined_var')"
                  :title-edit="$t('components.edit_predefined_var')"
                  :title-delete="$t('components.delete_this_predefined_var')"
                  @new-property="newProperty"
                  @edit-property="editProperty"
                  @delete-property="deleteProperty">
                </property-list>
                <hr class="mt-5 mb-4" />
                <property-list :collection="component.mappedVars"
                  collection-name = "mappedVars"
                  :title="$t('domain.component.mappedVars')"
                  :empty-message="$t('components.there_are_no_mapped_vars')"
                  :title-add-new="$t('components.new_mapped_var')"
                  :title-edit="$t('components.edit_mapped_var')"
                  :title-delete="$t('components.delete_this_mapped_var')"
                  @new-property="newProperty"
                  @edit-property="editProperty"
                  @delete-property="deleteProperty">
                </property-list>
              </template>
              <hr class="mt-5 mb-4" /> -->

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

export default {
  name: 'BotsForm',
  components: {
    AppPage,
    ConfigList,
    ComponentList,
    PropertyList,
    PropertyForm,
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
      config: {},
      configCollectionName: '',
      configCollectionIndex: -1,
      showConfigForm: false,
      showComponentList: false,
      validationErrors: [],
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
      data.property = data.bots[data.propertyCollectionName][data.propertyCollectionIndex];
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
      /* data.propertyFormTitle = event.propertyFormTitle;
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
      }; */
      chooseComponent();
    }

    function editConfig(event) {
      data.configCollectionName = event.configCollectionName;
      data.configCollectionIndex = event.configCollectionIndex;
      data.config = data.bots[data.configCollectionName][data.configCollectionIndex];
      // displayConfigForm();
    }

    function deleteConfig(event) {
      data.bot[event.configCollectionName].splice(event.configCollectionIndex, 1);
    }


    async function getBot() {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/bots/${data.id}/mine`);
        data.bot = response.data;
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
        const results = await context.root.axios.post('/bots/save', {
          bot: data.bot,
        });
        data.saving = false;
        data.saved = true;
        const { id } = results.data;
        context.root.$router.push({ name: 'botsView', params: { id } });
        window.scrollTo(0, 0);
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
      newConfig,
      editConfig,
      deleteConfig,
      chooseComponent,
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
