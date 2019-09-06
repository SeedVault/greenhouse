<template>
  <div class="legal-submenu">
    <div class="list-group list-group-flush">
      <router-link :to="{ name: 'legal-terms'}" class="list-group-item list-group-item-action">
        {{ $t('legal.tos.terms_of_service') }}
      </router-link>
      <router-link :to="{ name: 'legal-privacy'}" class="list-group-item list-group-item-action">
        {{ $t('legal.privacy.privacy_policy')}}
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-group-item {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-left: none;
  border-right: none;
}
</style>
