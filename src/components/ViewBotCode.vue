<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="getBackUrl">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <span id="hadron-container"
    data-bot-first-message="Hi"
    data-bot-size-class="tall"
    data-bot-placeholder=""
    data-bot-talks-first="true"
    data-bot-subtitle=""
    data-bot-voice-recognition-visible="false"
    data-bot-title="SEED Bot"
    :data-bot-external-css="getHadronUrl('https://hadron.botanic.io/sprout/sequoia_b.css')"
    :data-bot-launcher-external-css="getHadronUrl('/sprout/sequoia-launcher_b.css')"
    data-bot-load-font="Montserrat:300,400,600"
    :data-bot-bbot-uri="getRhizomeUrl('/')"
    data-bot-publisher-token="a5e83f01-14a9-4d8f-bc75-27cf0da3d9ef"
></span>

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
  name: 'ViewBotCode',
  components: {
    AppLayout,
  },
  props: ['context'],
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
    getHadronUrl(suffix) {
      return HADRON_URL + suffix
    },
    getRhizomeUrl(suffix) {
      return RHIZOME_URL + suffix
    },
    getData() {
      this.loading = true;
      this.axios.get(`/api/marketplace/bots/${this.id}`)
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
    getBackUrl() {
      switch (this.context) {
        case 'myProducts':
          return { name: 'botsView', params: { id: this.id } }
          break;
        case 'marketplace':
          return { name: 'marketplaceBotsView', params: { id: this.id } }
          break;
      }
    },
    snippet() {
      const dataBotExternalCss = this.getHadronUrl('/sprout/sequoia_b.css');
      const dataBotLauncherExternalCss = this.getHadronUrl('/sprout/sequoia-launcher_b.css');
      const dataBotBbotUri = this.getRhizomeUrl('/');
      const launcherBundleJs = this.getHadronUrl('/launcher.bundle.js');
      return `<span id="hadron-container"
    data-bot-first-message="Hi"
    data-bot-size-class="tall"
    data-bot-placeholder=""
    data-bot-talks-first="true"
    data-bot-subtitle=""
    data-bot-voice-recognition-visible="false"
    data-bot-title="SEED Bot"
    data-bot-external-css="${dataBotExternalCss}"
    data-bot-launcher-external-css="${dataBotLauncherExternalCss}"
    data-bot-load-font="Montserrat:300,400,600"
    data-bot-bbot-uri="${dataBotBbotUri}"
    data-bot-publisher-token="${this.token}"
></span>
<script type="text/javascript" src="${launcherBundleJs}"><\/script>`;
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
