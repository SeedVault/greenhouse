<template>
  <div class="row row-form">
    <div class="col-12 mb-4">
      <a class="back" @click.prevent="cancelPropertyForm()">
          <icon icon="chevron-left" />
          {{ $t('common.back') }}</a>
    </div>
    <div class="col-md-3">
      <h4>{{ title }}</h4>
    </div>
    <div class="col-md-9">
      <form @submit.prevent="saveProperty">
        <div class="form-row">
          <div class="form-group col-md-12">
            <input-text id="name" v-model="property.name"
            :label="$t('domain.property.name')"
              :placeholder="$t('domain.property.name_placeholder')"
              icon="fingerprint"
              :validationErrors="validationErrors"></input-text>
          </div>
          <div class="form-group col-md-12">
            <input-select id="valueType" v-model="property.valueType"
            :options="valueTypes()"
              :label="$t('domain.property.value_type')"
              icon="widgets"
              :validationErrors="validationErrors"></input-select>
          </div>
          <div class="form-group col-md-12" v-show="property.valueType !== 'fixed'">
            <input-select id="inputType" v-model="property.inputType"
            :options="inputTypes()"
              :label="$t('domain.property.input_type')"
              icon="widgets"
              :validationErrors="validationErrors"></input-select>
          </div>
          <div class="form-group col-md-12" v-show="property.valueType !== 'fixed'
          && property.inputType === 'select'">
            <input-text id="options" v-model="property.options"
              :label="$t('domain.property.options')"
              :placeholder="$t('domain.property.options_placeholder')"
              icon="list"
              :validationErrors="validationErrors"></input-text>
          </div>
          <div class="form-group col-md-12" v-show="property.valueType !== 'fixed'">
            <input-select id="required" v-model="property.required"
            :options="requiredOptions()"
              :label="$t('domain.property.required')"
              icon="toggle"
              :validationErrors="validationErrors"></input-select>
          </div>
          <div class="form-group col-md-12" v-show="property.valueType === 'fixed'">
            <input-text id="value" v-model="property.value"
              :label="$t('domain.property.value')"
              :placeholder="$t('domain.property.value_placeholder')"
              icon="label"
              :validationErrors="validationErrors"></input-text>
          </div>
          <div class="form-group col-md-12">
            <input-textarea id="tooltip" v-model="property.tooltip"
            :label="$t('domain.property.tooltip')" :rows="5"
            :placeholder="$t('domain.property.tooltip_placeholder')"
            icon="help"
            :validationErrors="validationErrors"></input-textarea>
          </div>
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
import usePropertyValidator from '@/use/PropertyValidator';

export default {
  name: 'PropertyForm',
  props: ['property', 'title'],
  setup(props, context) {
    const data = reactive({
      validationErrors: [],
    });

    const propertyValidator = usePropertyValidator();

    function saveProperty() {
      data.validationErrors = propertyValidator.validateDefinition(props.property);
      if (Object.keys(data.validationErrors).length === 0) {
        context.emit('save-property', props.property);
      }
    }

    function cancelPropertyForm() {
      context.emit('cancel-property-from', props.property);
    }

    function valueTypes() {
      const inputTypeList = [];
      const { allPropertyValueTypes } = context.root.$store.getters;
      for (let i = 0; i < allPropertyValueTypes.length; i += 1) {
        inputTypeList.push({
          value: allPropertyValueTypes[i],
          text: context.root.$i18n.t(`domain.property_value_types.${allPropertyValueTypes[i]}`),
        });
      }
      return inputTypeList;
    }

    function inputTypes() {
      const inputTypeList = [];
      const { allPropertyInputTypes } = context.root.$store.getters;
      for (let i = 0; i < allPropertyInputTypes.length; i += 1) {
        inputTypeList.push({
          value: allPropertyInputTypes[i],
          text: context.root.$i18n.t(`domain.property_input_types.${allPropertyInputTypes[i]}`),
        });
      }
      return inputTypeList;
    }

    function requiredOptions() {
      return [
        { value: 'yes', text: this.$i18n.t('common.yes') },
        { value: 'no', text: this.$i18n.t('common.no') },
      ];
    }

    return {
      ...toRefs(data),
      propertyValidator,
      saveProperty,
      cancelPropertyForm,
      valueTypes,
      inputTypes,
      requiredOptions,
    };
  },
};
</script>
