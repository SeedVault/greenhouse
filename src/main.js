import Vue from 'vue';
import '@/config/use-composition-api';
import 'seed-theme/src/seed-theme';
import axios from '@/config/axios';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from '@/config/i18n';

Vue.config.productionTip = false;
Vue.prototype.axios = axios;

// Register function to detect admin user
Vue.prototype.userIsAdmin = () => store.getters.user.username.toLowerCase()
=== process.env.VUE_APP_API_ADMIN_USERNAME.toLowerCase();

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
