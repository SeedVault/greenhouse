<template>
  <app-page>
    <template v-slot:main>

      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <span id="hadron-container"
        data-bot-first-message="Hi"
        data-bot-size-class="tall"
        data-bot-placeholder=""
        data-bot-talks-first="true"
        data-bot-subtitle=""
        data-bot-voice-recognition-visible="true"
        data-bot-voice-recognition-continuous="true"
        data-bot-voice-recognition-stoplistening-command="stop listening"
        :data-bot-title="bot.name"
        :data-bot-external-css="getHadronUrl('/sprout/sequoia_b.css')"
        :data-bot-launcher-external-css="getHadronUrl('/sprout/sequoia-launcher_b.css')"
        data-bot-load-font="Montserrat:300,400,600"
        :data-bot-bbot-uri="getRhizomeUrl('')"
        data-bot-publisher-token="a5e83f01-14a9-4d8f-bc75-27cf0da3d9ef"
        data-bot-tts-locale="en_GB"
        data-bot-tts-voice-id="0"
        data-bot-track-anonymous-user-id="true"
      ></span>

      <back-box :to="urlToGoBack()" v-if="!loading && !oops">
        <div class="row row-form">
          <div class="col-md-3">
            <h4><img class="component-logo-small"
            :src="subscription.bot.pictureUrl" />{{ subscription.bot.name }}</h4>
          </div>
          <div class="col-md-9">
            <div class="form-group">
            <label for="snippet">{{ $t('bots.copy_html_code') }}</label>
            <textarea v-model="snippet" id="snippet" class="form-control" rows="20"></textarea>
            </div>
          </div>
        </div>
      </back-box>

    </template>
    <router-view/>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';
import { reactive, toRefs, computed } from '@vue/composition-api';

export default {
  name: 'BotCode',
  components: {
    AppPage,
  },
  props: ['screen'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      id: '',
      bot: {
        category: 'general',
        status: 'enabled',
        user: {},
      },
      subscription: {},
      subscribed: false,
    });

    data.id = context.root.$route.params.id;

    async function getBot() {
      try {
        data.loading = true;
        data.oops = false;
        const response = await context.root.axios.get(`/bots/${data.id}/subscription`);
        data.bot = response.data.bot;
        data.subscription = response.data;
        data.subscribed = response.data.token !== '';
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    function urlToGoBack() {
      let routeName = 'marketplaceBotsView';
      if (props.screen === 'users') {
        routeName = 'usersBotsView';
      }
      return {
        name: routeName,
        params: { id: data.id, username: context.root.$route.params.username },
      };
    }

    function getHadronUrl(suffix) {
      return process.env.VUE_APP_HADRON_URL + suffix;
    }

    function getRhizomeUrl(suffix) {
      return process.env.VUE_APP_RHIZOME_URL + suffix;
    }

    const snippet = computed(() => {
      const dataBotExternalCss = getHadronUrl('/sprout/sequoia_b.css');
      const dataBotLauncherExternalCss = getHadronUrl('/sprout/sequoia-launcher_b.css');
      const dataBotBbotUri = getRhizomeUrl('');
      const launcherBundleJs = getHadronUrl('/launcher.bundle.js');
      return `<span id="hadron-container"
    data-bot-first-message="Hi"
    data-bot-size-class="tall"
    data-bot-placeholder=""
    data-bot-talks-first="true"
    data-bot-subtitle=""
    data-bot-voice-recognition-visible="true"
    data-bot-voice-recognition-continuous="true"
    data-bot-voice-recognition-stoplistening-command="stop listening"
    data-bot-title="${data.bot.name}"
    data-bot-external-css="${dataBotExternalCss}"
    data-bot-launcher-external-css="${dataBotLauncherExternalCss}"
    data-bot-load-font="Montserrat:300,400,600"
    data-bot-bbot-uri="${dataBotBbotUri}"
    data-bot-publisher-token="${data.subscription.token}"
    data-bot-uses-3d-avatar="true"
    data-bot-uses-3d-text-panel="false"
    data-bot-uses-3d-avatar-cam-pos-x="5"
    data-bot-uses-3d-avatar-cam-pos-y="72"
    data-bot-uses-3d-avatar-cam-pos-z="60"
    data-bot-uses-3d-avatar-cam-target-pos-x="0"
    data-bot-uses-3d-avatar-cam-target-pos-y="72"
    data-bot-uses-3d-avatar-cam-target-pos-z="0"
    data-bot-track-anonymous-user-id="true"
></span>
<script type="text/javascript" src="${launcherBundleJs}"><\/script>`; // eslint-disable-line no-useless-escape
    });

    getBot();

    return {
      ...toRefs(data),
      getBot,
      urlToGoBack,
      getHadronUrl,
      getRhizomeUrl,
      snippet,
    };
  },
};

</script>

<style lang="scss" scoped>
.component-logo-small {
  margin-right: 15px;
  vertical-align: middle;
  width: 26px;
  border-radius: 5px;
}
</style>
