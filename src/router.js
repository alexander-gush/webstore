import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('./views/Catalog.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('./views/Cart.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('./views/Orders.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('./views/Registration.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./views/Account.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue'),
    },
  ],
});
