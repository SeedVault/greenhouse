<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <select :value="value" class="form-control" @input="$emit('input', $event.target.value)">
      <option v-for="option in options" :key="option">
        {{option}}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  name: 'PropertyInputSelect',
  props: ['name', 'label', 'value', 'options']
}
</script>
