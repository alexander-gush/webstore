<template>
  <div :class="['catalog-item', {'catalog-item--in-cart' : inCart}]">
    <v-card>
      <v-card-actions
        v-if="editable && !inCart"
        class="catalog-item__editable-block"
      >
        <v-btn x-small fab color="success" @click="editItem">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn x-small fab color="error" @click="deleteCatalogItem(id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
      <v-img
        catalog-item
        class="catalog-item__img"
        :src="img"
        :aspect-ratio="12/10"
        :contain="true"
      />
      <div class="catalog-item__info">
        <v-card-title class="catalog-item__title">
          <div v-if="!makeEdition" v-text="title" class="catalog-item__title-text"/>
          <v-text-field
            v-else
            clearable
            label="Title"
            :value='title'
            :error="inputTitleError"
            @input="inputTitle"
          />
        </v-card-title>
        <v-card-text  v-if="!inCart" class="catalog-item__desc">
          <div v-if="!makeEdition" v-text="desc"></div>
          <v-text-field
            v-else
            clearable
            label="Description"
            :value='desc'
            :error="inputDescError"
            @input="inputDesc"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions v-if="makeEdition" class="catalog-item__edition-buttons">
          <v-btn tile color="green" @click="cancelChanges">
            <v-icon left>mdi-cancel</v-icon>
            cancel
          </v-btn>
          <v-btn tile color="green" @click="saveChanges">
            <v-icon left>mdi-content-save</v-icon>
            save
          </v-btn>
        </v-card-actions>
        <v-card-text v-text="`$${price}`" class="catalog-item__price"/>
      </div>
      <v-card-actions v-if="buyable" class="catalog-item__buy">
        <v-btn
          tile
          :disabled="itemInCart"
          @click="addToCart"
        >
          add to cart
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="inCart">
        <v-btn
          x-small
          fab
          color="error"
          class=catalog-item__delete-from-cart
          @click="deleteItemFromCart"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="catalog-item__quantity">
          Quantity:
          <v-text-field
            hide-details
            single-line
            type="number"
            min="1"
            max="100"
            class=catalog-item__input-number
            :value="quantity"
            @input="inputQuantity"
          />
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'CatalogItem',
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
    inCart: {
      type: Boolean,
    },
    editable: {
      type: Boolean,
    },
    buyable: {
      type: Boolean,
    },
    id: {
      type: String,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    price: {
      type: String,
    },
    quantity: {
      type: Number,
    },
  },
  created() {
    this.tempTitle = this.title;
    this.tempDesc = this.desc;
  },
  computed: {
    ...mapState([
      'cart',
    ]),
    ...mapGetters({
      userId: 'id',
    }),
    itemInCart() {
      return this.cart.findIndex(cartItem => cartItem.id === this.id) !== -1;
    },
  },
  methods: {
    ...mapActions([
      'deleteCatalogItem',
      'changeCart',
      'deleteCart',
      'editCatalogItem',
    ]),
    inputTitle(value) {
      this.tempTitle = value;
      this.inputTitleError = false;
    },
    inputDesc(value) {
      this.tempDesc = value;
      this.inputDescError = false;
    },
    editItem() {
      this.makeEdition = true;
    },
    deleteItemFromCart() {
      const cart = this.cart.slice();
      const index = cart.findIndex(cartItem => cartItem.id === this.id);
      cart.splice(index, 1);
      if (cart.length) {
        this.changeCart(cart);
      } else {
        this.deleteCart();
      }
    },
    cancelChanges() {
      this.tempTitle = this.title;
      this.tempDesc = this.desc;
      this.makeEdition = false;
    },
    saveChanges() {
      if (!this.tempTitle) {
        this.inputTitleError = true;
        return;
      }
      if (!this.tempDesc) {
        this.inputDescError = true;
        return;
      }
      this.makeEdition = false;
      this.editCatalogItem({
        id: this.id,
        title: this.tempTitle,
        desc: this.tempDesc,
      });
    },
    addToCart() {
      const item = {
        id: this.id,
        img: this.img,
        price: this.price,
        title: this.tempTitle,
        desc: this.tempDesc,
      };
      const cart = this.cart.slice();
      item.quantity = 1;
      cart.push(item);
      this.changeCart(cart);
    },
    inputQuantity(value) {
      const cart = this.cart.slice();
      const item = cart.find(cartItem => cartItem.id === this.id);
      const itemIndex = cart.findIndex(cartItem => cartItem.id === this.id);
      if (value > 100) {
        item.quantity = 100;
      } else if (value < 1) {
        item.quantity = 1;
      } else {
        item.quantity = value;
      }
      cart.splice(itemIndex, 1, item);
      this.changeCart(cart);
    },
  },
};
</script>

<style lang="sass">
  .catalog-item
    border: 1px solid #cfcfcf
    border-top: 0
    text-align: center
    .v-card
      border-radius: 0
      box-shadow: none
      padding: 20px 10px
    .v-text-field__details
      display: none
    &__img
      margin-bottom: 15px
    &__title
      align-items: flex-start
      font-size: 20px
      line-height: 30px
      height: 50px
      overflow: hidden
      padding: 0
      &-text
        width: 100%
    &__desc
      font-size: 16px
      line-height: 25px
      height: 50px
      overflow: hidden
      padding: 0
      margin-bottom: 10px
    &__editable-block
      justify-content: flex-end
      margin-bottom: 10px
      padding: 0
      .v-btn
        box-shadow: none
    &__price
      padding: 0
      margin-bottom: 10px
      font-size: 20px
      color: #cfcfcf
      text-align: center
    &__buy
      .v-btn
        margin: 0 auto
        background-color: #cfcfcf
        color: #7d7d7d
        width: 180px
        height: 40px
        box-shadow: none
        span
          text-transform: uppercase
    &__quantity
      display: flex
      align-items: center
    &__edition-buttons
      margin: 20px 0
      padding: 0
      .v-btn
        box-shadow: none
    &--in-cart
      &:first-child
        border-top: 1px solid #cfcfcf
      .v-card
        display: flex
        align-items: center
      .v-image
        width: 200px
        flex-grow: 0
      .catalog-item__info
        margin: 0 50px 0 10px
    &__delete-from-cart
      position: absolute
      top: 10px
      right: 10px
    &__input-number
      width: 50px
      margin: 0 0 0 10px
      padding-top: 0
</style>
