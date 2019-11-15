import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';

const defaultAxios = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 3000,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    requestCount: 0,
    users: [],
    user: { role: 'guest' },
    cart: [],
    catalog: [],
    orders: [],
    error: '',
  },
  mutations: {
    incRequestCount(state) {
      state.requestCount += 1;
    },
    decRequestCount(state) {
      state.requestCount -= 1;
    },
    signOut(state) {
      state.user = { role: 'guest' };
      state.cart = [];
      state.orders = [];
      localStorage.removeItem('user');
      if (router.currentRoute.path !== '/') {
        router.push({ path: '/' });
      }
    },
    setCatalog(state, data) {
      state.catalog = data;
    },
    setUsers(state, data) {
      state.users = data;
    },
    setUser(state, data) {
      localStorage.setItem('user', JSON.stringify(data));
      state.user = data;
    },
    setCart(state, { items }) {
      state.cart = items;
    },
    setOrders(state, data) {
      state.orders = data;
    },
    setError(state, errorMessage) {
      if (errorMessage) {
        state.error = errorMessage;
        return;
      }
      state.error = '';
    },
  },

  actions: {
    // eslint-disable-next-line
    async requestAction({ commit }, {
      method, url, data = null, config = null, params = null,
    }) {
      try {
        commit('setError');
        commit('incRequestCount');
        return await defaultAxios({
          method, url, data, config, params,
        });
      } catch (e) {
        if (e.response) {
          commit('setError', e.response.data.message);
        } else {
          commit('setError', 'Something went wrong. Please refresh the page and try again.');
        }
      } finally {
        commit('decRequestCount');
      }
    },

    async getCatalog({ dispatch, commit }, sort = null) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'get',
          url: 'catalog',
          params: { sort },
        });
        commit('setCatalog', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async createCatalogItem({ dispatch, commit }, item) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'catalog/create',
          data: item,
          config: {
            headers: { 'Content-Type': 'multipart/form-data;' },
          },
        });
        commit('setCatalog', data);
      // eslint-disable-next-line
      } catch (e) {}
    },
    async deleteCatalogItem({ dispatch, commit }, id) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'catalog/delete',
          data: { id },
        });
        commit('setCatalog', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async editCatalogItem({ dispatch, commit }, item) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'catalog/edit',
          data: item,
        });
        commit('setCatalog', data);
      // eslint-disable-next-line
      } catch (e) {}
    },
    async getUsers({ dispatch, commit }) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'get',
          url: 'users',
        });
        commit('setUsers', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async createUser({ dispatch, commit }, item) {
      try {
        if (item.registration) {
          await dispatch('requestAction', {
            method: 'post',
            url: 'users/create',
            data: item,
          });
        } else {
          const { data } = await dispatch('requestAction', {
            method: 'post',
            url: 'users/create',
            data: item,
          });
          commit('setUsers', data);
        }
      // eslint-disable-next-line
      } catch (e) {}
    },

    async editUser({ dispatch, commit }, item) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'users/edit',
          data: item,
        });
        commit('setUsers', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async deleteUser({ dispatch, commit }, id) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'users/delete',
          data: { id },
        });
        commit('setUsers', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async disableUser({ dispatch, commit }, id) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'users/disable',
          data: { id },
        });
        commit('setUsers', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async restoreUser({ dispatch, commit }, id) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'users/restore',
          data: { id },
        });
        commit('setUsers', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async restoreUserPassword({ dispatch }, email) {
      try {
        await dispatch('requestAction', {
          method: 'post',
          url: 'users/restore-password',
          data: { email },
        });
      // eslint-disable-next-line
      } catch (e) {}
    },

    async userLogin({ dispatch, commit }, item) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'get',
          url: 'users/login',
          params: { item },
        });
        commit('setUser', data.user);
        router.push({ path: '/' });
        if (data.cart) {
          commit('setCart', data.cart);
        }
      // eslint-disable-next-line
      } catch (e) {}
    },

    async changeUserPassword({ dispatch, commit }, item) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'users/change-password',
          data: item,
        });
        commit('setUser', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async getCart({ dispatch, commit, getters }) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'get',
          url: 'carts',
          params: { id: getters.id },
        });
        if (data) {
          commit('setCart', data);
        }
      // eslint-disable-next-line
      } catch (e) {}
    },

    async changeCart({ dispatch, commit, getters }, cart) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'carts/change',
          data: { id: getters.id, items: cart },
        });
        commit('setCart', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async deleteCart({ dispatch, commit, getters }) {
      try {
        await dispatch('requestAction', {
          method: 'post',
          url: 'carts/delete',
          data: { id: getters.id },
        });
        commit('setCart', { items: [] });
      // eslint-disable-next-line
      } catch (e) {}
    },

    async getOrders({ dispatch, commit, getters }) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'get',
          url: 'orders',
          params: { id: getters.id, role: getters.role },
        });
        commit('setOrders', data);
      // eslint-disable-next-line
      } catch (e) {}
    },

    async createOrder({ dispatch, getters }, cart) {
      try {
        await dispatch('requestAction', {
          method: 'post',
          url: 'orders/create',
          data: {
            userId: getters.id,
            userName: getters.name,
            items: cart,
            status: 'pending',
          },
        });
      // eslint-disable-next-line
      } catch (e) {}
    },

    async changeOrderStatus({ dispatch, commit, getters }, { id, status }) {
      try {
        const { data } = await dispatch('requestAction', {
          method: 'post',
          url: 'orders/change-status',
          data: {
            id,
            status,
            userId: getters.id,
            role: getters.role,
          },
        });
        commit('setOrders', data);
      // eslint-disable-next-line
      } catch (e) {}
    },
  },

  getters: {
    role: ({ user }) => user.role,
    isAdmin: ({ user }) => user.role === 'administrator',
    name: ({ user }) => user.name,
    password: ({ user }) => user.password,
    // eslint-disable-next-line
    id: ({ user }) => user._id,
    cartAmount: ({ cart }) => cart.length,
  },
});
