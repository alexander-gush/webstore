<template>
  <div class="order-item">
    <v-card>
      <v-card-text>
        <div
          v-if="role === 'salesperson'"
          v-text="`Order by user: ${user}`"
        />
        Order status: {{status}}
      </v-card-text>
      <v-card-text>
        <p v-text="'Contains:'"/>
        <ol>
          <li
            v-for="(item, index) in items"
            v-text="`${item.title}. Quantity ${item.quantity}.`"
            :key="index"
          />
        </ol>
      </v-card-text>
      <v-card-actions v-if="role === 'user' && status !== 'canceled'">
        <v-btn v-text="'cancel order'" tile color="red" @click="cancelOrder"/>
      </v-card-actions>
      <v-card-actions
        v-if="role === 'salesperson' && status === 'pending' && status !== 'canceled'"
      >
        <v-btn v-text="'accept order'" tile color="green" @click="acceptOrder"/>
        <v-btn v-text="'decline order'" tile color="red" @click="declineOrder"/>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'OrderItem',
  data() {
    return {
      makeEdition: false,
      tempTitle: '',
      tempDesc: '',
      inputTitleError: false,
      inputDescError: false,
    };
  },
  props: {
    user: {
      type: String,
    },
    status: {
      type: String,
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    items: {
      type: Array,
    },
    id: {
      type: String,
    },
  },
  methods: {
    ...mapActions([
      'changeOrderStatus',
    ]),
    cancelOrder() {
      this.changeOrderStatus({ id: this.id, status: 'canceled' });
    },
    acceptOrder() {
      this.changeOrderStatus({ id: this.id, status: 'accepted' });
    },
    declineOrder() {
      this.changeOrderStatus({ id: this.id, status: 'declined' });
    },
  },
  computed: {
    ...mapGetters([
      'role',
    ]),
  },
};
</script>

<style lang="sass">
  .order-item
    max-width: 400px
    margin-bottom: 20px
</style>
