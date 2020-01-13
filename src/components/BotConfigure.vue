<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <simple-box v-if="showConfigForm">
        <a class="back" @click.prevent="closeConfigForm()">
          <icon icon="chevron-left" />
          {{ $t('common.back') }}</a>
        <publisher-config-form
          :config="configForUser"
          :values="configValues"
          @save-config="saveConfig"
        ></publisher-config-form>
      </simple-box>

      <back-box :to="urlToGoBack()" v-if="!saving && !saved && !loading
        && !oops && !showConfigForm">

        <full-centered v-slot:main v-if="saving || saved">
          <loading-checkmark visible="false" :loading="saving" showCheckmark="saved" >
          </loading-checkmark>
        </full-centered>

        <div class="row row-form" v-show="!saving && !saved">
          <div class="col-md-3">
            <h4><img class="component-logo-small"
            :src="subscription.bot.pictureUrl" />{{ subscription.bot.name }}</h4>
          </div>
          <div class="col-md-9">
            <validation-box id="_" :validationErrors="validationErrors"></validation-box>
            <form @submit.prevent="save" v-show="!saving">
              <div class="form-group">
                <input-select v-model="subscription.subscriptionType"
                  :options="pricingOptions()" id="subscriptionType"
                  :label="$t('domain.component.pricing_model')"
                  icon="types"
                  :validationErrors="validationErrors"></input-select>
              </div>

              <!-- Properties -->
             <hr class="mb-4" />
             <template v-if="subscription.bot.properties.length > 0">
                <publisher-config-list
                  config-type = "bot"
                  component-type = "botengine"
                  :items="subscription.bot.properties"
                  :collection="subscription.properties"
                  collection-name = "properties"
                  :title="$t('domain.bot.properties')"
                  :cache="cachedMetadata"
                  @edit-config="editConfig">
                </publisher-config-list>
                <hr class="mt-5 mb-4" />
             </template>

             <!-- Bot Engine -->
              <template v-if="subscription.bot.botengine.length > 0">
                <publisher-config-list
                  config-type = "component"
                  component-type = "botengine"
                  :items="subscription.bot.botengine"
                  :collection="subscription.botengine"
                  collection-name = "botengine"
                  :title="$t('domain.bot.bot_engine')"
                  :cache="cachedMetadata"
                  @edit-config="editConfig">
                </publisher-config-list>
                <hr class="mt-5 mb-4" />
              </template>

              <!-- Services -->
              <template v-if="subscription.bot.services.length > 0">
                <publisher-config-list
                  config-type = "component"
                  component-type = "service"
                  :items="subscription.bot.services"
                  :collection="subscription.services"
                  collection-name = "services"
                  :title="$t('domain.bot.services')"
                  :cache="cachedMetadata"
                  @edit-config="editConfig">
                </publisher-config-list>
                <hr class="mt-5 mb-4" />
              </template>

              <!-- Channels -->
              <template v-if="subscription.bot.channels.length > 0">
                <publisher-config-list
                  config-type = "channel"
                  component-type = "channel"
                  :items="subscription.bot.channels"
                  :collection="subscription.channels"
                  collection-name = "channels"
                  :title="$t('domain.bot.channels')"
                  :cache="cachedMetadata"
                  @edit-config="editConfig">
                </publisher-config-list>
                <hr class="mt-5 mb-4" />
              </template>

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
import PublisherConfigList from '@/components/PublisherConfigList.vue';
import PublisherConfigForm from '@/components/PublisherConfigForm.vue';

export default {
  name: 'BotConfigure',
  components: {
    AppPage,
    PublisherConfigList,
    PublisherConfigForm,
  },
  props: ['screen'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      saving: false,
      saved: false,
      id: '',
      subscription: {
        bot: {
          category: 'general',
          status: 'enabled',
          user: {},
        },
        subscriptionType: '',
        properties: [],
        botengines: [],
        services: [],
        channels: [],
      },
      configCollectionName: '',
      configCollectionIndex: -1,
      configSelectTitle: '',
      configComponentType: 'service',
      configForUser: {
        properties: {},
      },
      configValues: {},
      showConfigForm: false,
      validationErrors: [],
      cachedMetadata: new Map(),
    });

    data.id = context.root.$route.params.id;

    function urlToGoBack() {
      let routeName = 'marketplaceBotsView';
      if (props.screen === 'users') {
        routeName = 'usersBotsView';
      }
      return {
        name: routeName,
        params: { id: data.id, username: context.root.$route.params.username },
      };
    }

    function pricingOptions() {
      const pricingOptionsList = [];
      if (data.subscription.bot.pricingModel === 'free') {
        pricingOptionsList.push({
          value: 'free',
          text: context.root.$i18n.t('domain.pricing_models.free'),
        });
      } else {
        if (data.subscription.bot.pricingModel === 'pay_per_month' || data.subscription.bot.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'month',
            text: `${context.root.$i18n.t('domain.component.price_per_month')
            }(${data.subscription.bot.pricePerMonth} SEED)`,
          });
        }
        if (data.subscription.bot.pricingModel === 'pay_per_use' || data.subscription.bot.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'use',
            text: `${context.root.$i18n.t('domain.component.price_per_use')
            }(${data.subscription.bot.pricePerUse} SEED)`,
          });
        }
      }
      return pricingOptionsList;
    }

    function closeConfigForm() {
      data.showConfigForm = false;
      setTimeout(() => {
        document.getElementById(data.configCollectionName).scrollIntoView();
      }, 100);
    }

    async function configureComponent() {
      // eslint-disable-next-line max-len
      data.configForUser = data.subscription.bot[data.configCollectionName][data.configCollectionIndex];
      data.configValues = {
        component: data.configForUser._id,
        values: new Map(),
      };
      let current = null;
      if (data.configCollectionIndex !== -1) {
        current = data.subscription[data.configCollectionName][data.configCollectionIndex];
        if (typeof current.values === 'undefined') {
          current.values = new Map();
        }
      }

      const collectionNames = ['properties', 'headers', 'predefinedVars', 'mappedVars'];
      for (let i = 0; i < collectionNames.length; i++) {
        const collectionName = collectionNames[i];
        for (let j = 0; j < data.configForUser[collectionName].length; j++) {
          const property = data.configForUser[collectionName][j];
          data.configValues.values.set(property._id, property.value);
          if (data.configCollectionIndex !== -1) {
            if (current.values.has(property._id)) {
              data.configValues.values.set(property._id, current.values.get(property._id));
            }
          }
        }
      }
      data.showConfigForm = true;
    }

    function editConfig(event) {
      data.configCollectionName = event.configCollectionName;
      data.configCollectionIndex = event.configCollectionIndex;
      data.configComponentType = event.configComponentType;
      data.scrollPosition = document.getElementById(data.configCollectionName).offsetTop;
      window.scrollTo(0, 0);
      configureComponent();
    }

    function saveConfig(event) {
      data.showConfigForm = false;
      data.subscription[data.configCollectionName][data.configCollectionIndex] = event.values;
      closeConfigForm();
    }

    async function getSubscription() {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get(`/bots/${data.id}/subscription`);
        data.subscription = response.data;
        if (data.subscription.token === '') {
          switch (data.subscription.bot.pricingModel) {
            case 'free':
              data.subscription.subscriptionType = 'free';
              break;
            case 'pay_per_use':
              data.subscription.subscriptionType = 'use';
              break;
            case 'pay_per_month':
              data.subscription.subscriptionType = 'month';
              break;
            case 'pay_per_use_or_month':
              data.subscription.subscriptionType = 'month';
              break;
            default:
              // do nothing
          }
        }
        data.cachedMetadata = new Map();
        const collectionNames = ['properties', 'botengine', 'services', 'channels'];
        for (let i = 0; i < collectionNames.length; i++) {
          const c = collectionNames[i];
          for (let j = 0; j < data.subscription.bot[c].length; j++) {
            data.cachedMetadata.set(data.subscription.bot[c][j]._id, {
              _id: data.subscription.bot[c][j]._id,
              name: data.subscription.bot[c][j].name,
              pictureUrl: data.subscription.bot[c][j].pictureUrl,
              properties: data.subscription.bot[c][j].properties,
              headers: data.subscription.bot[c][j].headers,
              predefinedVars: data.subscription.bot[c][j].predefinedVars,
              mappedVars: data.subscription.bot[c][j].mappedVars,
            });
            // Convert object to Maps
            if (typeof data.subscription[c][j] === 'undefined') {
              data.subscription[c][j] = {
                component: data.subscription.bot[c][j]._id,
                values: new Map(),
              };
            } else {
              const mapData = new Map();
              const keys = Object.keys(data.subscription[c][j].values);
              for (let k = 0; k < keys.length; k++) {
                mapData.set(keys[k], data.subscription[c][j].values[keys[k]]);
              }
              data.subscription[c][j].values = mapData;
            }
          }
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
        const botData = Object.assign({}, data.subscription);
        delete botData.bot;
        const collectionNames = ['properties', 'botengine', 'services', 'channels'];
        for (let i = 0; i < collectionNames.length; i++) {
          const c = collectionNames[i];
          for (let j = 0; j < botData[c].length; j++) {
            botData[c][j].values = JSON.stringify([...botData[c][j].values]);
          }
        }
        await context.root.axios.post(`/bots/${data.id}/subscribe`, {
          subscription: botData,
        });
        data.saving = false;
        data.saved = true;
        let routeName = 'marketplaceBotsView';
        if (props.screen === 'users') {
          routeName = 'usersBotsView';
        }
        context.root.$router.push({ name: routeName, params: { id: data.id } });
      } catch (error) {
        data.saving = false;
        if (error.response.status === 422) {
          data.validationErrors = context.root.normalizeErrors(error.response);
        } else {
          data.oops = true;
        }
      }
    }

    getSubscription();

    return {
      ...toRefs(data),
      getSubscription,
      urlToGoBack,
      pricingOptions,
      editConfig,
      saveConfig,
      closeConfigForm,
      save,
    };
  },
};

</script>

<style lang="scss" scoped>
.component-logo-small {
  margin-right: 15px;
  vertical-align: middle;
  width: 26px;
  border-radius: 5px;
}

hr {
  border: none;
  border-top: 1px solid #f6f6f6;
}
</style>
