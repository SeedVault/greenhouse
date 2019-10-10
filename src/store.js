import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Data source:
// https://github.com/stefangabos/world_countries/blob/master/data/en/countries.json
export default new Vuex.Store({
  state: {
    lang: 'en',
    userChecked: false,
    user: null,
    logo: '/images/application_logo_greenhouse.svg',
    logoImage: '/images/logo_greenhouse.svg',
    logoText: '/images/text_greenhouse.svg',
    logoTextWidth: '104px',
    allComponentCategories: ['general', 'weather'],
    allComponentTypes: ['botengine', 'service', 'channel'],
    allComponentStatuses: ['enabled', 'disabled'],
    allPropertyValueTypes: ['fixed', 'developer', 'publisher'],
    allPropertyInputTypes: ['select', 'text', 'textarea'],
    allBotCategories: ['general', 'weather'],
    allBotStatuses: ['enabled', 'disabled'],
    allPricingModels: ['free', 'pay_per_use', 'pay_per_month', 'pay_per_use_or_month'],
    allHttpMethods: ['GET', 'POST'],
    menu: [
      {
        text: 'app.dashboard',
        icon: 'outline-dashboard-24px@2x.svg',
        target: 'dashboard',
      },
      {
        text: 'app.marketplace',
        icon: 'outline-marketplace-24px.svg',
        target: 'marketplaceBotsList',
      },
      {
        text: 'app.my_products',
        icon: 'outline-my-products-24px.svg',
        target: 'botsList',
      },
      {
        text: 'app.my_data',
        icon: 'outline-security-24px@2x.svg',
        target: 'myData',
      },
      {
        text: 'app.community',
        icon: 'icon-community-24px.svg',
        target: 'community',
      },
    ],
    apps: [
      {
        text: 'apps.accounts',
        icon: 'outline-app-24px@2x.svg',
        url: `${process.env.NODE_ENV === 'production' ? 'https://accounts.seedtoken.io' : 'https://127.0.0.1:9000'}/{{ locale }}/profile`,
      },
      {
        text: 'apps.wallet',
        icon: 'outline-app-24px@2x.svg',
        url: `${process.env.NODE_ENV === 'production' ? 'https://wallet-dev.seedtoken.io' : 'https://127.0.0.1:9001'}/{{ locale }}/dashboard`,
      },
    ],
  },
  getters: {
    /* eslint-disable no-shadow */
    lang: state => state.lang,
    apps: state => state.apps,
    user: state => state.user,
    userChecked: state => state.userChecked,
    menu: state => state.menu,
    logo: state => state.logo,
    logoImage: state => state.logoImage,
    logoText: state => state.logoText,
    logoTextWidth: state => state.logoTextWidth,
    allComponentCategories: state => state.allComponentCategories,
    allComponentTypes: state => state.allComponentTypes,
    allComponentStatuses: state => state.allComponentStatuses,
    allPropertyValueTypes: state => state.allPropertyValueTypes,
    allPropertyInputTypes: state => state.allPropertyInputTypes,
    allBotCategories: state => state.allBotCategories,
    allBotStatuses: state => state.allBotStatuses,
    allPricingModels: state => state.allPricingModels,
    allHttpMethods: state => state.allHttpMethods,
  },
  mutations: {
    SET_LANG(state, params) {
      state.lang = params.lang;
    },
    SET_USER(state, params) {
      state.user = params.user;
    },
    SET_USER_CHECKED(state, params) {
      state.userChecked = params.userChecked;
    },
  },
  actions: {
    setLang({ commit }, params) {
      commit('SET_LANG', params);
    },
    setUser({ commit }, params) {
      commit('SET_USER', params);
    },
    setUserChecked({ commit }, params) {
      commit('SET_USER_CHECKED', params);
    },
  },
});
