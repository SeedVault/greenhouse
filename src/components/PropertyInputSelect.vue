<template>
  <div class="form-group">
    <label :for="id">{{ label }} <help-tooltip :tooltip="tooltip"></help-tooltip></label>
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
export default {
  name: 'PropertyInputSelect',
  props: ['id', 'name', 'label', 'value', 'options', 'tooltip', 'validationErrors'],
};
</script>
