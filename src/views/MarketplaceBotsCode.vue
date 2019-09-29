<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'marketplaceBotsView', params: { id: this.id } }">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <div class="row row-form">
              <div class="col-md-3">
                <h4 class="bot-title">{{ name }}</h4>
              </div>
              <div class="col-md-9">
                <div class="form-group">
                <label for="snipper">{{ $t('bots.copy_html_code') }}</label>
                <textarea v-model="snippet" id="snippet" class="form-control" rows="15"></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';

export default {
  name: 'MarketplaceBotsCode',
  components: {
    AppLayout,
  },
  data() {
    return {
      id: '',
      loading: false,
      oops: false,

      name: '',
      token: '',

      validationErrors: [],
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/markteplace/bots/${this.id}`)
        .then((result) => {
          const ids = [];
          this.loading = false;
          this.name   = result.data.bot.name;
          this.token  = result.data.subscription.token;
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
  },
  computed: {
    snippet() {
      return `<span id="hadron-container"
    data-bot-first-message="Hi"
    data-bot-size-class="tall"
    data-bot-placeholder=""
    data-bot-talks-first="true"
    data-bot-subtitle=""
    data-bot-voice-recognition-visible="false"
    data-bot-title="SEED Bot"
    data-bot-external-css="https://hadron.botanic.io/sprout/sequoia_b.css"
    data-bot-launcher-external-css="https://hadron.botanic.io/sprout/sequoia-launcher_b.css"
    data-bot-load-font="Montserrat:300,400,600"
    data-bot-bbot-uri="https://rhizome.botanic.io/"
    data-bot-publisher-token="${this.token}"
></span>
<script type="text/javascript" src="https://hadron.botanic.io/launcher.bundle.js"><\/script>`;
    }
  }
}
</script>

<style lang="scss" scoped>
.saving {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

// Misc
h4.bot-title {
  margin-bottom: 0;
  font-weight: 500;
  line-height: 2;
}
</style>
