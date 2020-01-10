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

      <back-box :to="urlToGoBack()" v-show="!saving && !saved && !loading
        && !oops && !showPropertyForm">

        <full-centered v-slot:main v-if="saving || saved">
          <loading-checkmark visible="false" :loading="saving" showCheckmark="saved" >
          </loading-checkmark>
        </full-centered>

        <div class="row row-form" v-show="!saving && !saved">
          <div class="col-md-3">
            <template v-if="servicesOnly">
              <h4><template v-if="isNew()">{{ $t('services.new_service') }}</template>
              <template v-else>{{ $t('services.modify_service') }}</template></h4>
            </template>
            <template v-else>
              <h4><template v-if="isNew()">{{ $t('components.new_component') }}</template>
              <template v-else>{{ $t('components.modify_component') }}</template></h4>
            </template>
          </div>

          <div class="col-md-9">

              <validation-box id="_" :validationErrors="validationErrors"></validation-box>

              <form @submit.prevent="save" v-show="!saving">

              <div class="form-row" v-if="!showPropertyForm">
                <div class="form-group col-md-12" v-if="userIsAdmin()">
                  <input-select v-model="component.componentType"
                    :options="componentTypes()" id="componentType"
                    :label="$t('domain.component.component_type')"
                    icon="products"
                    :validationErrors="validationErrors"></input-select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-select v-model="component.category"
                    :options="componentCategories()" id="category"
                    :label="$t('domain.component.category')"
                    icon="types"
                    :validationErrors="validationErrors"></input-select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="component.name" id="name"
                    :label="$t('domain.component.name')"
                    :placeholder="servicesOnly === false? $t('domain.component.name_placeholder'):
                    $t('domain.service.name_placeholder')"
                    icon="component"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="component.description" id="description"
                    :label="$t('domain.component.description')"
                    :placeholder="$t('domain.component.description_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-textarea v-model="component.features" id="features"
                    :label="$t('domain.component.features')" :rows="5"
                    :placeholder="$t('domain.component.features_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-textarea v-model="component.license" id="license"
                    :label="$t('domain.component.license')"
                    :tooltip="$t('domain.component.license_tooltip')" :rows="5"
                    :placeholder="$t('domain.component.license_placeholder')"
                    icon="text"
                    :validationErrors="validationErrors"></input-textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="component.url" id="url"
                    :label="$t('domain.component.url')"
                    :placeholder="$t('domain.component.url_placeholder')"
                    icon="url"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-4">
                  <input-select v-model="component.httpMethod"
                    :options="httpMethods()"
                    id="httpMethod"
                    :label="$t('domain.component.http_method')"
                    icon="list"
                    :validationErrors="validationErrors"></input-select>
                </div>
                <div class="form-group col-md-4">
                  <input-text v-model="component.timeout" id="timeout"
                    :label="$t('domain.component.timeout')"
                    :placeholder="$t('domain.component.timeout')"
                    icon="timer"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <input-text v-model="component.key" id="key"
                    :label="$t('domain.component.key')"
                    :placeholder="$t('domain.component.key_placeholder')"
                    icon="code"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-4">
                  <input-select v-model="component.pricingModel"
                    :options="pricingModels()" id="pricingModel"
                    :tooltip="$t('domain.component.pricing_model_tooltip')"
                    :label="$t('domain.component.pricing_model')"
                    icon="types"
                    :validationErrors="validationErrors"></input-select>
                </div>
                <div class="form-group col-md-4">
                  <input-text v-show="component.pricingModel==='pay_per_use'
                    || component.pricingModel==='pay_per_use_or_month'"
                    v-model="component.pricePerUse"
                    id="pricePerUse" :label="$t('domain.bot.price_per_use')"
                    :placeholder="$t('domain.component.price_per_use')"
                    icon="coin"
                    :validationErrors="validationErrors"></input-text>
                </div>
                <div class="form-group col-md-4">
                  <input-text
                    v-show="component.pricingModel==='pay_per_month'
                    || component.pricingModel==='pay_per_use_or_month'"
                    v-model="component.pricePerMonth" id="pricePerMonth"
                    :label="$t('domain.bot.price_per_month')"
                    :placeholder="$t('domain.component.price_per_month')"
                    icon="coin"
                    :validationErrors="validationErrors"></input-text>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-8">
                  <input-text v-model="component.functionName" id="functionName"
                    :label="$t('domain.component.function_name')"
                    :placeholder="$t('domain.component.function_name_placeholder')"
                    icon="function"
                    :validationErrors="validationErrors"></input-text>
                </div>

                <div class="form-group col-md-4">
                  <input-select v-model="component.status" id="status"
                    :options="componentStatuses()"
                    :label="$t('domain.component.status')"
                    icon="toggle"
                    :validationErrors="validationErrors"></input-select>
                </div>
              </div>

              <!-- Properties -->
              <hr class="mb-4" />
              <template v-if="component.componentType !== 'service'">
                <property-list :collection="component.properties"
                  collection-name = "properties"
                  :title="$t('domain.component.properties')"
                  :empty-message="$t('components.there_are_no_properties')"
                  :title-add-new="$t('components.new_property')"
                  :title-edit="$t('components.edit_property')"
                  :title-delete="$t('components.delete_this_property')"
                  @new-property="newProperty"
                  @edit-property="editProperty"
                  @delete-property="deleteProperty">
                </property-list>
              </template>
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
import PropertyList from '@/components/PropertyList.vue';
import PropertyForm from '@/components/PropertyForm.vue';

export default {
  name: 'ComponentForm',
  components: {
    AppPage,
    PropertyList,
    PropertyForm,
  },
  props: ['servicesOnly'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      saving: false,
      saved: false,
      id: '',
      component: {
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
        timeout: '30',
        pricingModel: 'free',
        pricePerUse: '',
        pricePerMonth: '',
        status: 'enabled',
        properties: [],
        headers: [],
        predefinedVars: [],
        mappedVars: [],
      },
      property: {},
      propertyFormTitle: '',
      propertyCollectionName: '',
      propertyCollectionIndex: -1,
      validationErrors: [],
      showPropertyForm: false,
    });

    if (typeof context.root.$route.params.id === 'undefined') {
      data.id = '';
      data.component.componentType = 'channel';
      if (props.servicesOnly) {
        data.component.componentType = 'service';
      }
    } else {
      data.id = context.root.$route.params.id;
    }

    function isNew() {
      return (data.id === '');
    }

    function urlToGoBack() {
      let routeName = 'usersComponents';
      if (props.servicesOnly) {
        routeName = 'usersServices';
      }
      if (isNew()) {
        return {
          name: routeName,
          params: { username: context.root.$route.params.username },
        };
      }
      routeName = `${routeName}View`;
      const { id } = data;
      return {
        name: routeName,
        params: {
          username: context.root.$route.params.username,
          id,
        },
      };
    }

    function componentTypes() {
      const componentTypeList = [];
      const { allComponentTypes } = context.root.$store.getters;
      for (let i = 0; i < allComponentTypes.length; i += 1) {
        componentTypeList.push({
          value: allComponentTypes[i],
          text: context.root.$i18n.t(`domain.component_types.${allComponentTypes[i]}`),
        });
      }
      return componentTypeList;
    }


    function componentCategories() {
      const componentCategoryList = [];
      const { allComponentCategories } = context.root.$store.getters;
      for (let i = 0; i < allComponentCategories.length; i += 1) {
        componentCategoryList.push({
          value: allComponentCategories[i],
          text: context.root.$i18n.t(`domain.component_categories.${allComponentCategories[i]}`),
        });
      }
      return componentCategoryList;
    }


    function componentStatuses() {
      const componentStatusList = [];
      const { allComponentStatuses } = context.root.$store.getters;
      for (let i = 0; i < allComponentStatuses.length; i += 1) {
        componentStatusList.push({
          value: allComponentStatuses[i],
          text: context.root.$i18n.t(`domain.component_statuses.${allComponentStatuses[i]}`),
        });
      }
      return componentStatusList;
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
      data.property = data.component[data.propertyCollectionName][data.propertyCollectionIndex];
      displayPropertyForm();
    }

    function deleteProperty(event) {
      data.component[event.propertyCollectionName].splice(event.propertyCollectionIndex, 1);
    }

    function closePropertyForm() {
      data.showPropertyForm = false;
      setTimeout(() => {
        document.getElementById(data.propertyCollectionName).scrollIntoView();
      }, 100);
    }

    function saveProperty() {
      if (data.propertyCollectionIndex === -1) {
        data.component[data.propertyCollectionName].push(data.property);
      } else {
        data.component[data.propertyCollectionName][data.propertyCollectionIndex] = data.property;
      }
      closePropertyForm();
    }

    async function getComponent() {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/components/${data.id}`);
        data.component = response.data;
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
        const results = await context.root.axios.post('/components/save', {
          component: data.component,
        });
        data.saving = false;
        data.saved = true;
        const { id } = results.data;
        let routeName = 'usersComponentsView';
        if (props.servicesOnly === true) {
          routeName = 'usersServicesView';
        }
        context.root.$router.push({ name: routeName, params: { id } });
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
      getComponent();
    }

    return {
      ...toRefs(data),
      isNew,
      urlToGoBack,
      componentTypes,
      componentCategories,
      componentStatuses,
      pricingModels,
      httpMethods,
      saveProperty,
      closePropertyForm,
      newProperty,
      editProperty,
      deleteProperty,
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
