<template>
  <v-app class="app">
    <v-overlay v-if="isWaitingForRequest">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <top-toolbar
      :cartAmount="cartAmount"
    />
    <v-content class="app__content">
      <router-view/>
    </v-content>
    <v-alert v-if="error" type="error" class="app__error">
      {{ error }}
    </v-alert>
  </v-app>
</template>

<script>
import {
  mapState, mapActions, mapGetters, mapMutations,
} from 'vuex';
import TopToolbar from '@/components/layout/TopToolbar.vue';


export default {
  name: 'App',
  components: {
    TopToolbar,
  },
  created() {
    if (localStorage.getItem('user') !== null) {
      const user = JSON.parse(localStorage.getItem('user'));
      this.setUser(user);
      if (this.role === 'user') {
        this.getCart();
      }
    }
  },
  methods: {
    ...mapActions([
      'getCart',
    ]),
    ...mapMutations([
      'setUser',
    ]),
  },
  computed: {
    ...mapState([
      'requestCount',
      'error',
    ]),
    ...mapGetters([
      'cartAmount',
      'role',
    ]),
    isWaitingForRequest() {
      return this.requestCount > 0;
    },
  },
};
</script>

<style lang='sass'>
header
  max-height: 64px
.v-application--wrap
  background: white
.v-content
  background: white
  .v-content__wrap
    max-width: 1200px
    min-width: 320px
    margin: 0 auto
    padding: 0 30px
.app__error
    position: fixed
    bottom: 0
    width: 80%
    left: 10%
    margin-bottom: 10px
</style>
