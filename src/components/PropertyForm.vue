<template>
  <div>
    <form>

      <validation-box id="_" :validationErrors="validationErrors"></validation-box>

      <component v-for="(property, _id) in properties"
        :key="_id"
        :is="property.inputType"
        :label="property.name"
        :tooltip="property.tooltip"
        :id="inputName(property._id)"
        :name="inputName(property._id)"
        :value="propertiesData[inputName(property._id)]"
        :validationErrors="validationErrors"
        :propertiesData="propertiesData"
        :valueType="valueType"
        @input="updateForm(inputName(property._id), $event)"
        v-show="checkValueType(property.valueType)"
        v-bind="property">
      </component>
    </form>
  </div>
</template>

<script>
import PropertyInputText from '@/components/PropertyInputText.vue';
import PropertyInputTextarea from '@/components/PropertyInputTextarea.vue';
import PropertyInputSelect from '@/components/PropertyInputSelect.vue';

export default {
  name: 'PropertyForm',
  components: {
    PropertyInputText,
    PropertyInputTextarea,
    PropertyInputSelect,
  },
  props: ['properties', 'value', 'validationErrors', 'propertiesData', 'valueType'],
  data() {
    return {
      // propertiesData: this.value || {}
    };
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.propertiesData, fieldName, value);
      this.$emit('input', this.propertiesData);
    },
    inputName(_id) {
      return `_${_id}`;
    },
    checkValueType(propertyValueType) {
      return propertyValueType === this.valueType;
    },
  },
};
</script>
