<template>
  <v-toolbar fixed class="header">
    <v-toolbar-title v-text="'Smart Shop'" @click="goToCatalog"/>
    <v-spacer/>
    <div v-if="role === 'user'" class="header__cart" @click="goToCart">
      <v-badge v-if="cartAmount > 0">
        <span slot="badge" v-text="cartAmount"/>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </div>
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn v-on="on" fab class="header__menu-button">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <div v-if="role === 'guest'">
          <v-list-item @click="goToLogin">
            <v-list-item-title v-text="'Sign In'"/>
          </v-list-item>
          <v-list-item @click="goToRegistration">
            <v-list-item-title v-text="'Registration'"/>
          </v-list-item>
        </div>
        <div v-if="role === 'user'">
          <v-list-item @click="goToAccount">
            <v-list-item-title v-text="'My account'"/>
          </v-list-item>
          <v-list-item @click="goToOrders">
            <v-list-item-title v-text="'My orders'"/>
          </v-list-item>
        </div>
        <v-list-item v-if="role !== 'guest'" @click="signOut">
          <v-list-item-title v-text="'Sign Out'"/>
        </v-list-item>
        <v-list-item v-if="role === 'salesperson'" @click="goToOrders">
          <v-list-item-title v-text="'See orders'"/>
        </v-list-item>
        <v-list-item v-if="role == 'administrator'" @click="goToUsers">
          <v-list-item-title v-text="'See users'"/>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TopToolbar',
  props: {
    cartAmount: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters([
      'role',
    ]),
  },
  methods: {
    ...mapMutations([
      'signOut',
    ]),
    push(url) {
      if (this.$route.path === url) {
        return;
      }
      this.$router.push({ path: url });
    },
    goToLogin() {
      this.push('/login');
    },
    goToCatalog() {
      this.push('/');
    },
    goToCart() {
      this.push('/cart');
    },
    goToRegistration() {
      this.push('/registration');
    },
    goToAccount() {
      this.push('/account');
    },
    goToOrders() {
      this.push('/orders');
    },
    goToUsers() {
      this.push('/users');
    },
  },
};
</script>

<style lang='sass'>
#app
  .v-toolbar__title
    cursor: pointer
  .header
    background: #3c3c3c
    color: white
    box-shadow: none
    &__cart
      margin-right: 40px
      cursor: pointer
      .v-icon.v-icon
        color: white

  @media (max-width: 1000px)
    .header__menu-button
      width: 50px
      height: 50px
</style>
