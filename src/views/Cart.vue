<template>
  <div class="cart">
    <h2 v-text="'Cart'" class="mb-5"/>
    <h3 v-if="!cart.length" v-text="'Empty'"/>
    <div v-else>
      <div class="cart__items">
        <catalog-item
          class="cart__item"
          v-for="(item, index) in cart"
          :key="index"
          :inCart=true
          :img="Object.keys(item.img).length ? item.img : ''"
          :id="item.id"
          :title="item.title"
          :desc="item.desc"
          :price="item.price"
          :quantity="+item.quantity"
        />
      </div>
      <div class="cart__bottom">
        <h3 v-text="`Total price: ${totalPrice}$`"/>
        <v-btn v-text="'Make order'" tile x-large color="green" @click="makeOrder"/>
      </div>
    </div>
    <v-dialog v-model="orderMade" width="500">
      <v-card>
        <v-card-title v-text="'Congratulations'" primary-title class="headline grey lighten-2"/>
        <v-card-text v-text="'your order has been received.'"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="'To orders'" @click="goToOrders"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import CatalogItem from '@/components/catalog/CatalogItem.vue';

export default {
  name: 'cart',
  components: {
    CatalogItem,
  },
  data: () => ({
    orderMade: false,
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    ...mapActions([
      'deleteCart',
      'createOrder',
    ]),
    fetchData() {
      if (this.role !== 'user') {
        this.$router.push({ path: '/' });
      }
    },
    makeOrder() {
      this.deleteCart();
      this.createOrder(this.cart);
      this.orderMade = true;
    },
    goToOrders() {
      this.orderMade = false;
      this.$router.push({ path: '/orders' });
    },
  },
  computed: {
    ...mapState([
      'cart',
      'orders',
    ]),
    ...mapGetters([
      'role',
    ]),
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
};
</script>

<style lang='sass'>
  .cart
    padding: 50px 0 100px
    &__item
      max-width: 700px
    &__bottom
      margin-top: 100px
      display: flex
      max-width: 700px
      justify-content: space-between
      align-items: center
</style>
