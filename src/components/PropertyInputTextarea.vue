<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <textarea
      :id="id"
      :name="name"
      :value="value"
      :class="{'form-control': true,
      'is-invalid':(validationErrors[id] !== undefined)}"
      @input="$emit('input', $event.target.value)" rows="3"></textarea>
    <validation-messages :id="id" :validationErrors="validationErrors"></validation-messages>
  </div>
</template>


<script>
export default {
  name: 'PropertyInputTextarea',
  props: ['id', 'name', 'label', 'value', 'validationErrors'],
};
</script>
