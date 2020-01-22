<template>
  <div class="row row-form my-4">
    <div class="col-md-3 mb-4">
      <h4>
        <img :src="config.pictureUrl" class="component-logo-small" />{{ config.name }}
      </h4>
    </div>
    <div class="col-md-9">
      <form @submit.prevent="saveConfig">
        <div class="form-group">
          <input-select v-model="values.subscriptionType"
            :options="pricingOptions()" id="subscriptionType"
            :label="$t('domain.component.pricing_model')"
            icon="types"
            @input="updateValues('subscriptionType', $event)"
            :validationErrors="validationErrors"></input-select>
        </div>
        <hr class="mt-4 mb-4" />
        <div v-for="(collectionName, index) in collectionNames" :key="index">
          <template v-if="typeof config[collectionName] !== 'undefined'
            && config[collectionName].length > 0">
            <h5 class="my-4">{{ $t(`domain.component.${collectionName}`) }}</h5>
            <component v-for="(property, _id) in config[collectionName]"
              :key="_id"
              :is="findInputType(property)"
              :label="property.name"
              :tooltip="property.tooltip"
              :id="property._id"
              :name="property._id"
              @input="updateValues(property._id, $event)"
              :value="values.values.get(property._id)"
              :validationErrors="validationErrors"
              v-bind="property">
            </component>
          </template>
        </div>
        <div class="form-row">
          <div class="form-group col-md-4 mt-2">
            <input type="submit" id="submit" :value="$t('common.continue')"
              class="btn btn-lg btn-primary px-5 font-weight-bold"/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import ConfigInputSelect from '@/components/ConfigInputSelect.vue';
import ConfigInputText from '@/components/ConfigInputText.vue';
import ConfigInputTextarea from '@/components/ConfigInputTextarea.vue';
import usePropertyValidator from '@/use/PropertyValidator';

export default {
  name: 'ConfigForm',
  components: {
    ConfigInputSelect,
    ConfigInputText,
    ConfigInputTextarea,
  },
  props: ['config', 'values'],
  setup(props, context) {
    const data = reactive({
      validationErrors: [],
      collectionNames: ['properties', 'headers', 'predefinedVars', 'mappedVars'],
    });

    const propertyValidator = usePropertyValidator();

    function findInputType(property) {
      let sControl = '';
      switch (property.inputType) {
        case 'text':
          sControl = 'ConfigInputText';
          break;
        case 'textarea':
          sControl = 'ConfigInputTextarea';
          break;
        case 'select':
          sControl = 'ConfigInputSelect';
          break;
        default:
          // do nothing
      }
      return sControl;
    }

    function pricingOptions() {
      if (typeof props.config === 'undefined') {
        return [];
      }
      const pricingOptionsList = [];
      if (props.config.pricingModel === 'free') {
        pricingOptionsList.push({
          value: 'free',
          text: context.root.$i18n.t('domain.pricing_models.free'),
        });
      } else {
        if (props.config.pricingModel === 'pay_per_month' || props.config.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'month',
            text: `${context.root.$i18n.t('domain.component.price_per_month')
            }(${props.config.pricePerMonth} SEED)`,
          });
        }
        if (props.config.pricingModel === 'pay_per_use' || props.config.pricingModel === 'pay_per_use_or_month') {
          pricingOptionsList.push({
            value: 'use',
            text: `${context.root.$i18n.t('domain.component.price_per_use')
            }(${props.config.pricePerUse} SEED)`,
          });
        }
      }
      return pricingOptionsList;
    }

    function saveConfig() {
      data.validationErrors = propertyValidator.validate(props.values, props.config);
      if (Object.keys(data.validationErrors).length === 0) {
        context.emit('save-config', { values: props.values });
      }
    }

    function updateValues(fieldName, value) {
      props.values.values.set(fieldName, value);
    }

    return {
      ...toRefs(data), findInputType, pricingOptions, saveConfig, updateValues,
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
</style>
