<template>
  <app-layout>
    <div class="row">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">
            <h4 class="card-title">{{ $t('app.privacy') }}</h4>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';

export default {
  name: 'Privacy',
  components: {
    AppLayout,
  },
};
</script>
