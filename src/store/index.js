import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lang: 'en',
    userChecked: false,
    user: null,
    csrf: null,
    menu: [
      /* {
        id: 1,
        text: 'app.dashboard',
        icon: 'dashboard',
        target: 'dashboard',
      }, */
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
        icon: 'bot',
        target: 'marketplaceBots',
        styles: 'background-color: #eee',
      },
      {
        id: 4,
        text: 'app.components',
        icon: 'component',
        target: 'marketplaceComponents',
        styles: 'background-color: #eee',
      },
      {
        id: 5,
        text: 'app.services',
        icon: 'service',
        target: 'marketplaceServices',
        styles: 'background-color: #eee; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; margin-bottom:15px;',
      },
      {
        id: 6,
        text: 'app.my_products',
        icon: 'products',
        target: 'usersMe',
      },
      {
        id: 7,
        text: 'app.my_data',
        icon: 'security',
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
        icon: 'gear',
        url: `${process.env.VUE_APP_ACCOUNTS_URL}/{{ locale }}/profile`,
      },
      {
        id: 10,
        text: 'apps.wallet',
        icon: 'seed-app',
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
        icon: 'community',
        target: 'community',
      },
      {
        id: 13,
        type: 'divider',
        text: '',
        icon: '',
      },
      {
        id: 14,
        text: 'app.sign_out',
        icon: 'exit',
        url: `${process.env.VUE_APP_GREENHOUSE_URL}/{{ locale }}/logout`,
      },
    ],
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
  },
  getters: {
    lang: state => state.lang,
    user: state => state.user,
    userChecked: state => state.userChecked,
    csrf: state => state.csrf,
    allRoles: state => state.allRoles,
    allCountries: state => state.allCountries,
    menu: state => state.menu,
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
    SET_CSRF(state, params) {
      state.csrf = params.csrf;
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
    setCsrf({ commit }, params) {
      commit('SET_CSRF', params);
    },
  },
  modules: {
  },
});
