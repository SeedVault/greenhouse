import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import EmptyRouter from './views/EmptyRouter.vue';
import i18n from './i18n';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: [
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
        next();
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import(/* webpackChunkName: "auth" */ './views/Home.vue'),
        },
        {
          path: 'legal/policy',
          name: 'legal-privacy',
          component: () => import(/* webpackChunkName: "auth" */ './views/LegalPrivacy.vue'),
        },
        {
          path: 'legal/tos',
          name: 'legal-terms',
          component: () => import(/* webpackChunkName: "auth" */ './views/LegalTerms.vue'),
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/Dashboard.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'products',
          name: 'myProducts',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/MyProducts.vue'),
          meta: { authenticated: true },
          children: [{
            path: 'bots',
            name: 'botsList',
            component: () => import(/* webpackChunkName: "greenhouse" */ './views/BotsList.vue'),
          },
          {
            path: 'components',
            name: 'componentsList',
            component: () => import(/* webpackChunkName: "greenhouse" */ './views/ComponentsList.vue'),
          }],
        },
        {
          path: 'products/components/form/:id?',
          name: 'componentsForm',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/ComponentsForm.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'products/components/:id',
          name: 'componentsView',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/ComponentsView.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'products/bots/form/:id?',
          name: 'botsForm',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/BotsForm.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'products/bots/:id',
          name: 'botsView',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/BotsView.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'marketplace',
          name: 'marketplace',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/Marketplace.vue'),
          meta: { authenticated: true },
        },
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import(/* webpackChunkName: "greenhouse" */ './views/Privacy.vue'),
          meta: { authenticated: true },
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
      component: () => import(/* webpackChunkName: "error" */ './views/Error.vue'),
    },
    {
      path: '*',
      redirect: '/error/404',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (!store.getters.userChecked) {
    try {
      const response = await axios.get('/auth/me');
      store.dispatch('setUser', { user: response.data });
      store.dispatch('setUserChecked', { userChecked: true });
    } catch (error) {
      if (error.response.status === 403) {
        store.dispatch('setUser', { user: null });
        store.dispatch('setUserChecked', { userChecked: true });
      } else {
        // Something went wrong. Ignore it.
      }
    }
  }

  if (to.matched.some(record => record.meta.authenticated) && !store.getters.user) {
    window.location.href = '/auth/login';
  } else {
    next();
  }
});

export default router;
