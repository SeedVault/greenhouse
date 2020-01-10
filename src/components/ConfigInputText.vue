<template>
  <div class="form-group">
    <label :for="id">{{ label }} <help-tooltip :tooltip="tooltip"></help-tooltip></label>
    <input type="text"
      :id="id"
      :name="name"
      :value="value"
      :class="{'form-control form-control-lg': true,
      'is-invalid':(validationErrors[id] !== undefined)}"
      @input="$emit('input', $event.target.value)" />
    <validation-messages :id="id" :validationErrors="validationErrors"></validation-messages>
  </div>
</template>


<script>
export default {
  name: 'ConfigInputText',
  props: ['id', 'name', 'label', 'value', 'tooltip', 'validationErrors'],
};
</script>
