<template>
  <img :src="require('@/assets/icons/outline-help_outline-24px@2x.svg')" :title="tooltip" v-if="tooltip.length > 0" class="help-tooltip" />
</template>
<script>
export default {
  name: 'PropertyTooltip',
  props: ['tooltip'],
};
</script>
<style lang="scss" scoped>
  .help-tooltip {
    width: 14px;
    height: 14;
    position: relative;
    top: -1px;
    left: 5px;

    &:hover {
      cursor:pointer;
    }
  }
</style>
