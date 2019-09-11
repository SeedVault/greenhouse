<template>
  <div>
    <form>

      <validation-box id="_" :validationErrors="validationErrors"></validation-box>

      <component v-for="(property, _id) in properties"
        :key="_id"
        :is="property.inputType"
        :label="property.name"
        :id="inputName(property._id)"
        :name="inputName(property._id)"
        :value="propertiesData[inputName(property._id)]"
        :validationErrors="validationErrors"
        :propertiesData="propertiesData"
        @input="updateForm(inputName(property._id), $event)"
        v-bind="property">
      </component>
    </form>
  </div>
</template>

<script>
import PropertyInputText from '@/components/PropertyInputText.vue';
import PropertyInputSelect from '@/components/PropertyInputSelect.vue';
export default {
  name: "PropertyForm",
  components: {
    PropertyInputText,
    PropertyInputSelect
  },
  props: ['properties', 'value', 'validationErrors', 'propertiesData'],
  data() {
    return {
      // propertiesData: this.value || {}
    };
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.propertiesData, fieldName, value);
      this.$emit("input", this.propertiesData);
    },
    inputName(_id) {
      return `_${_id}`;
    }
  }
};
</script>
