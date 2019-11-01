<template>
  <div class="form-group">
    <label :for="id">{{ label }} <property-tooltip :tooltip="tooltip"></property-tooltip></label>
    <select
      :id="id"
      :name="name"
      :value="value"
      :class="{'form-control': true,
      'is-invalid':(validationErrors[id] !== undefined)}"
       @input="$emit('input', $event.target.value)">
      <option v-for="option in options.split(',')" :key="option">
        {{option}}
      </option>
    </select>
    <validation-messages :id="id" :validationErrors="validationErrors"></validation-messages>
  </div>
</template>
<script>
import PropertyTooltip from '@/components/PropertyTooltip.vue';
export default {
  name: 'PropertyInputSelect',
  components: {
    PropertyTooltip,
  },
  props: ['id', 'name', 'label', 'value', 'options', 'tooltip', 'validationErrors'],
};
</script>
