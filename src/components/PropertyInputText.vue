<template>
  <div class="form-group">
    <label :for="id">{{ label }} <property-tooltip :tooltip="tooltip"></property-tooltip></label>
    <input type="text"
      :id="id"
      :name="name"
      :value="value"
      :class="{'form-control': true,
      'is-invalid':(validationErrors[id] !== undefined)}"
      @input="$emit('input', $event.target.value)" />
    <validation-messages :id="id" :validationErrors="validationErrors"></validation-messages>
  </div>
</template>


<script>
import PropertyTooltip from '@/components/PropertyTooltip.vue';
export default {
  name: 'PropertyInputText',
  components: {
    PropertyTooltip,
  },
  props: ['id', 'name', 'label', 'value', 'tooltip', 'validationErrors'],
};
</script>
