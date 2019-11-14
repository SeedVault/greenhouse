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
    allComponentCategories: [
      'coaching_and_training',
      'communication',
      'cryptocurrency',
      'customer_service',
      'design',
      'education',
      'entertainment',
      'events',
      'finance',
      'games',
      'general',
      'health_and_fitness',
      'healthcare',
      'marketing',
      'news',
      'personal',
      'security',
      'real_estate',
      'research',
      'retail',
      'support',
      'travel',
      'utilities',
      'weather',
    ],
    allComponentTypes: ['botengine', 'service', 'channel'],
    allComponentStatuses: ['enabled', 'disabled'],
    allPropertyValueTypes: ['fixed', 'developer', 'publisher'],
    allPropertyInputTypes: ['select', 'text', 'textarea'],
    allBotCategories: [
      'coaching_and_training',
      'communication',
      'cryptocurrency',
      'customer_service',
      'design',
      'education',
      'entertainment',
      'events',
      'finance',
      'games',
      'general',
      'health_and_fitness',
      'healthcare',
      'marketing',
      'news',
      'personal',
      'security',
      'real_estate',
      'research',
      'retail',
      'support',
      'travel',
      'utilities',
      'weather',
    ],
    allBotStatuses: ['enabled', 'disabled'],
    allPricingModels: ['free', 'pay_per_use', 'pay_per_month', 'pay_per_use_or_month'],
    allHttpMethods: ['GET', 'POST'],
    menu: [
      {
        id: 1,
        text: 'app.dashboard',
        icon: 'outline-dashboard-24px@2x.svg',
        target: 'dashboard',
      },
      {
        id: 2,
        type: 'group',
        text: 'app.marketplace',
        icon: '',
        styles: 'background-color: #eee; border-top-left-radius: 10px; border-top-right-radius: 10px; margin-top:15px;',
      },
      {
        id: 3,
        text: 'app.bots',
        icon: 'outline-bot-icon-24.svg',
        target: 'marketplaceBotsList',
        styles: 'background-color: #eee',
      },
      {
        id: 4,
        text: 'app.components',
        icon: 'outline-component-24px.svg',
        target: 'marketplaceComponentsList',
        styles: 'background-color: #eee',
      },
      {
        id: 5,
        text: 'app.services',
        icon: 'icon-service-24px.svg',
        target: 'marketplaceServicesList',
        styles: 'background-color: #eee; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; margin-bottom:15px;',
      },
      {
        id: 6,
        text: 'app.my_products',
        icon: 'outline-my-products-24px.svg',
        target: 'botsList',
      },
      {
        id: 7,
        text: 'app.my_data',
        icon: 'outline-security-24px@2x.svg',
        target: 'myData',
      },
      {
        id: 8,
        type: 'divider',
        text: '',
        icon: '',
        target: '',
      },
      {
        id: 9,
        text: 'apps.accounts',
        icon: 'icon-gear.svg',
        url: `${process.env.VUE_APP_ACCOUNTS_URL}/{{ locale }}/profile`,
      },
      {
        id: 10,
        text: 'apps.wallet',
        icon: 'outline-app-24px@2x.svg',
        url: `${process.env.VUE_APP_WALLET_URL}/{{ locale }}/dashboard`,
      },
      {
        id: 11,
        type: 'divider',
        text: '',
        icon: '',
        target: '',
      },
      {
        id: 12,
        text: 'app.community',
        icon: 'icon-community-24px.svg',
        target: 'community',
      },
    ],
  },
  getters: {
    /* eslint-disable no-shadow */
    lang: state => state.lang,
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
