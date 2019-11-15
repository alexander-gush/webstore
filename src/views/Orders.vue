<template>
  <div class="orders">
    <h2 v-text="'Orders'" class="mb-10"/>
    <order-item
      v-for="(order, index) in orders" :key="index"
      class="order__item"
      :user="order.userName"
      :status="order.status"
      :items="order.items"
      :id="order._id"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import OrderItem from '@/components/order/OrderItem.vue';

export default {
  name: 'orders',
  components: {
    OrderItem,
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    ...mapActions([
      'getOrders',
    ]),
    fetchData() {
      if (this.role === 'guest' || this.role === 'administrator') {
        this.$router.push({ path: '/' });
        return;
      }
      this.getOrders();
    },
  },
  computed: {
    ...mapState([
      'orders',
    ]),
    ...mapGetters([
      'role',
    ]),
  },
};
</script>

<style lang='sass'>
  .orders
    padding-top: 50px
    &__items
      display: flex
      flex-wrap: wrap
      margin: 0 -20px
    &__item
      width: calc(25% - 40px)
      margin: 0 20px 40px
</style>
