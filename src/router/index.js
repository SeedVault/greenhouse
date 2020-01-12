import Vue from 'vue';
import VueRouter from 'vue-router';
import EmptyRouter from 'seed-theme/src/views/EmptyRouter.vue';
import moment from 'moment';
import axios from '@/config/axios';
import i18n from '@/config/i18n';
import store from '@/store/index';
import cookies from '@/config/cookies';

Vue.use(VueRouter);

// eslint-disable-next-line func-names
Vue.prototype.humanDate = function (date) {
  return moment(date).fromNow();
};

function mustMatchTheLoggedInUsername(to, from, next) {
  if (store.getters.user.username !== to.params.username) {
    next('/error/403');
  }
  next();
}

const routes = [
  {
    path: '/',
    beforeEnter(to, from, next) {
      let locale = cookies.getCookie('locale');
      if (i18n.availableLocales.includes(locale)) {
        i18n.locale = locale;
      } else {
        const browserLang = navigator.language || navigator.userLanguage;
        if (typeof browserLang !== 'undefined') {
          [locale] = browserLang.split('-');
          if (i18n.availableLocales.includes(locale)) {
            i18n.locale = locale;
          }
        }
      }
      next(`/${i18n.locale}/home`);
    },
  },
  {
    path: '/:locale',
    component: EmptyRouter,
    props: true,
    beforeEnter(to, from, next) {
      const { locale } = to.params;
      if (!i18n.availableLocales.includes(locale)) {
        next('/error/404');
      }
      if (i18n.locale !== locale) {
        i18n.locale = locale;
      }
      store.dispatch('setLang', { lang: i18n.locale });
      moment.locale(i18n.locale);
      next();
    },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'legal/privacy',
        name: 'legal-privacy',
        component: () => import(/* webpackChunkName: "legal" */ '@/views/LegalPrivacy.vue'),
      },
      {
        path: 'legal/terms',
        name: 'legal-terms',
        component: () => import(/* webpackChunkName: "legal" */ '@/views/LegalTerms.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "greenhouse" */ '@/views/Dashboard.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'marketplace',
        name: 'marketplace',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/Marketplace.vue'),
        beforeEnter(to, from, next) {
          next(to.params);
        },
        meta: { authenticated: true },
        children: [{
          path: 'bots',
          name: 'marketplaceBots',
          component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceBots.vue'),
        },
        {
          path: 'components',
          name: 'marketplaceComponents',
          component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceComponents.vue'),
        },
        {
          path: 'services',
          name: 'marketplaceServices',
          component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceServices.vue'),
        }],
      },
      {
        path: 'marketplace/bots/:id',
        name: 'marketplaceBotsView',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceBotsView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'marketplace/bots/:id/configure',
        name: 'marketplaceBotsConfigure',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceBotsConfigure.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'marketplace/components/:id',
        name: 'marketplaceComponentsView',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceComponentsView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'marketplace/services/:id',
        name: 'marketplaceServicesView',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/MarketplaceServicesView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'users',
        name: 'usersMe',
        component: EmptyRouter,
        props: true,
        beforeEnter(to, from, next) {
          next({
            name: 'usersBots',
            params: {
              locale: i18n.locale,
              username: store.getters.user.username,
            },
          });
        },
        meta: { authenticated: true },
      },
      {
        path: 'users/:username?',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/Users.vue'),
        beforeEnter(to, from, next) {
          next(to.params);
        },
        meta: { authenticated: true },
        children: [{
          path: 'bots',
          name: 'usersBots',
          component: () => import(/* webpackChunkName: "users" */ '@/views/UsersBots.vue'),
        },
        {
          path: 'components',
          name: 'usersComponents',
          component: () => import(/* webpackChunkName: "users" */ '@/views/UsersComponents.vue'),
        },
        {
          path: 'services',
          name: 'usersServices',
          component: () => import(/* webpackChunkName: "users" */ '@/views/UsersServices.vue'),
        }],
      },
      {
        path: 'users/:username/bots/form/:id?',
        name: 'usersBotsForm',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersBotsForm.vue'),
        meta: { authenticated: true },
        beforeEnter: mustMatchTheLoggedInUsername,
      },
      {
        path: 'users/:username/components/form/:id?',
        name: 'usersComponentsForm',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersComponentsForm.vue'),
        meta: { authenticated: true },
        beforeEnter: mustMatchTheLoggedInUsername,
      },
      {
        path: 'users/:username/bots/:id',
        name: 'usersBotsView',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersBotsView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'users/:username/bots/:id/configure',
        name: 'usersBotsConfigure',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersBotsConfigure.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'users/:username/services/form/:id?',
        name: 'usersServicesForm',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersServicesForm.vue'),
        meta: { authenticated: true },
        beforeEnter: mustMatchTheLoggedInUsername,
      },
      {
        path: 'users/:username/components/:id',
        name: 'usersComponentsView',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersComponentsView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'users/:username/services/:id',
        name: 'usersServicesView',
        component: () => import(/* webpackChunkName: "users" */ '@/views/UsersServicesView.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'my-data',
        name: 'myData',
        component: () => import(/* webpackChunkName: "greenhouse" */ '@/views/MyData.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'community',
        name: 'community',
        component: () => import(/* webpackChunkName: "greenhouse" */ '@/views/Community.vue'),
        meta: { authenticated: true },
      },
      {
        path: 'logout',
        name: 'logout',
        beforeEnter(to, from, next) {
          axios.get('/auth/logout').finally(() => {
            store.dispatch('setUser', { user: null });
            store.dispatch('setUserChecked', { userChecked: false });
            next(`/${i18n.locale}/home`);
          });
        },
      },
    ],
  },
  {
    path: '/error/:httpError(\\d+)',
    name: 'error',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "error" */ 'seed-theme/src/views/Error.vue'),
  },
  {
    path: '*',
    redirect: '/error/404',
  },
];

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.getters.userChecked) {
    try {
      const response = await axios.get('/auth/me');
      if (typeof (response.data.csrfToken) !== 'undefined') {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
      }
      store.dispatch('setUser', { user: response.data.user });
      store.dispatch('setUserChecked', { userChecked: true });
    } catch (error) {
      if (typeof (error.response.data.csrfToken) !== 'undefined') {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = error.response.data.csrfToken;
      }
      if (error.response.status === 401) { // User is not logged in
        store.dispatch('setUser', { user: null });
        store.dispatch('setUserChecked', { userChecked: false });
      } else {
        // Something went wrong. Just ignore it.
      }
    }
  }

  if (to.matched.some(record => record.meta.authenticated) && !store.getters.user) {
    try {
      const response = await axios.get('/auth/me');
      if (response.status === 200) {
        if (typeof (response.data.csrfToken) !== 'undefined') {
          axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
        }
        store.dispatch('setUser', { user: response.data.user });
        store.dispatch('setUserChecked', { userChecked: true });
        document.location.reload();
      }
    } catch (error) {
      // Do nothing
    }
    const callbackURL = `${window.location.protocol}//${window.location.host}${to.path}`;
    window.location.href = `${process.env.VUE_APP_ACCOUNTS_URL}/${i18n.locale}/sign-in?callbackURL=${callbackURL}`;
  } else {
    // eslint-disable-next-line
    if (to.name === 'home' && store.getters.user) {
      next(`/${i18n.locale}/dashboard`);
    } else {
      next();
    }
  }
});

window.onfocus = async () => {
  if (store.getters.userChecked === true) {
    try {
      const response = await axios.get('/auth/me');
      store.dispatch('setUser', { user: response.data.user });
    } catch (error) {
      if (error.response.status === 401) { // User is not logged in anymore
        store.dispatch('setUser', { user: null });
        store.dispatch('setUserChecked', { userChecked: false });
        document.location = `/${i18n.locale}/home`;
      }
    }
  }
};

export default router;
