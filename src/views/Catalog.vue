<template>
  <div class="catalog">
    <v-btn
      v-if="role === 'salesperson'"
      v-text="'Create good'"
      tile
      x-large
      color="blue"
      class="mb-10"
      @click="showCreateForm"
    />
    <div class="catalog__sort mb-10">
      Sort:
      <v-select
        item-text="text"
        item-value="value"
        placeholder="order by"
        :items="sortSelectItems"
        :value="sortSelectItem"
        @change="selectSort"
      />
    </div>
    <div class="catalog__items">
      <catalog-item
        v-for="(item, index) in catalog"
        class="catalog__item"
        :key="index"
        :img="getImagePath(item.img)"
        :id="item._id"
        :title="item.title"
        :desc="item.desc"
        :price="item.price"
        :editable="itemsEditable"
        :buyable="itemsBuyable"
      />
    </div>
    <v-dialog v-model="createFormVisibility" width="500">
      <v-card>
        <v-card-title v-text="'Create new good:'" primary-title class="headline grey lighten-2"/>
        <v-card-text class="mt-5">
          <v-text-field
            required
            type="text"
            label="Good title"
            placeholder="Title"
            :value="itemTitle"
            :error-messages="itemTitleError"
            @input="inputTitle"
          />
          <v-text-field
            required
            type="text"
            label="Good description"
            placeholder="Description"
            :value="itemDesc"
            :error-messages="itemDescError"
            @input="inputDesc"
          />
          <v-text-field
            required
            type="number"
            label="Good price"
            placeholder="Price"
            :value="itemPrice"
            :error-messages="itemPriceError"
            @input="inputPrice"
          />
          <v-file-input
            required
            label="Good image"
            placeholder="Image"
            accept="image/png, image/jpeg,"
            :value="itemImage"
            :error-messages="itemImageError"
            @change="changeImage"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="'Create'" @click="createItem"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import CatalogItem from '@/components/catalog/CatalogItem.vue';

export default {
  name: 'catalog',
  components: {
    CatalogItem,
  },
  data: () => ({
    publicPath: process.env.BASE_URL,
    createFormVisibility: false,
    itemTitle: '',
    itemDesc: '',
    itemPrice: '',
    itemImage: null,
    itemTitleError: '',
    itemDescError: '',
    itemPriceError: '',
    itemImageError: '',
    sortSelectItem: {},
    sortSelectItems: [
      { text: 'price to high', value: '1' },
      { text: 'price to low', value: '-1' },
    ],
  }),
  created() {
    this.getCatalog();
  },
  methods: {
    ...mapActions([
      'getCatalog',
      'createCatalogItem',
    ]),
    selectSort(value) {
      this.getCatalog({ price: +value });
    },
    getImagePath(img) {
      return (process.env.NODE_ENV === 'production')
        ? img
        // eslint-disable-next-line
        : require(`../../backend/upload/${img}`);
    },
    showCreateForm() {
      this.createFormVisibility = true;
    },
    inputTitle(value) {
      this.itemTitle = value;
      if (!value) {
        this.itemTitleError = 'Required';
        return;
      }
      this.itemTitleError = '';
    },
    inputDesc(value) {
      this.itemDesc = value;
      if (!value) {
        this.itemDescError = 'Required';
        return;
      }
      this.itemDescError = '';
    },
    inputPrice(value) {
      this.itemPrice = value;
      if (!value) {
        this.itemPriceError = 'Required';
        return;
      }
      if (value <= 0 || value >= 1000000) {
        this.itemPriceError = 'Price should be more than 0 and less than 1000000';
        return;
      }
      this.itemPriceError = '';
    },
    changeImage(img) {
      if (!img) {
        this.itemImageError = 'Required';
        return;
      }
      this.itemImage = img;
      if (img.type !== 'image/png' && img.type !== 'image/jpeg') {
        this.itemImageError = 'Image should be png or jpeg type';
        return;
      }
      this.itemImageError = '';
    },
    createItem() {
      if (!this.itemTitle) {
        this.itemTitleError = 'Required';
      }
      if (!this.itemDesc) {
        this.itemDescError = 'Required';
      }
      if (!this.itemPrice) {
        this.itemPriceError = 'Required';
      }
      if (!this.itemImage) {
        this.itemImageError = 'Required';
      }
      if (this.itemTitleError || this.itemDescError || this.itemPriceError || this.itemImageError) {
        return;
      }
      const item = new FormData();
      item.append('title', this.itemTitle);
      item.append('desc', this.itemDesc);
      item.append('price', this.itemPrice);
      item.append('img', this.itemImage);
      this.createFormVisibility = false;
      this.itemTitle = '';
      this.itemDesc = '';
      this.itemPrice = '';
      this.itemImage = null;
      this.createCatalogItem(item);
    },
  },
  computed: {
    ...mapState([
      'catalog',
      'cart',
    ]),
    ...mapGetters({
      role: 'role',
    }),
    itemsEditable() {
      return this.role === 'salesperson';
    },
    itemsBuyable() {
      return this.role === 'user';
    },
  },
};
</script>

<style lang='sass'>
  .catalog
    padding: 50px 0 100px
    &__sort
      display: flex
      justify-content: flex-end
      align-items: baseline
      .v-input
        width: 200px
        max-width: 200px
        margin-left: 15px
    &__items
      display: flex
      flex-wrap: wrap
    &__item
      width: 25%
      border-left: 0
      &:nth-child(-n+4)
        border-top: 1px solid #cfcfcf
      &:nth-child(4n+1)
        border-left: 1px solid #cfcfcf
  @media (max-width: 1100px)
    .catalog
      &__item
        width: 33%
        &:nth-child(4)
          border-top: 0
        &:nth-child(4n+1)
          border-left: 0
        &:nth-child(3n+1)
          border-left: 1px solid #cfcfcf
  @media (max-width: 900px)
    .catalog
      &__item
        width: 50%
        &:nth-child(3)
          border-top: 0
        &:nth-child(3n+1)
          border-left: 0
        &:nth-child(2n+1)
          border-left: 1px solid #cfcfcf
  @media (max-width: 600px)
    .catalog
      &__item
        width: 100%
        border-left: 1px solid #cfcfcf
        &:nth-child(2)
          border-top: 0
        &:nth-child(n)
          border-left: 1px solid #cfcfcf
</style>
