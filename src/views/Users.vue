<template>
  <div class="users">
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="users"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title v-text="'Users'"/>
          <v-divider inset vertical class="mx-4"/>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" v-text="'New User'" dark class="mb-2" color="primary"/>
            </template>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedUser.role"
                        label="Role"
                        :items="roleSelectItems"
                        :error-messages="selectRoleError"
                        @input="selectRole"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.name"
                        label="Name"
                        :error-messages="inputNameError"
                        @input="inputName"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.email"
                        label="Email"
                        :error-messages="inputEmailError"
                        @input="inputEmail"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.password"
                        label="Password"
                        :error-messages="inputPasswordError"
                        @input="inputPassword"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-text="'Cancel'" text color="blue darken-1" @click="close"/>
                <v-btn v-text="'Save'" text color="blue darken-1" @click="save"/>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteUser(item._id)">mdi-delete</v-icon>
        <v-icon
          v-if="item.status == 'active'"
          v-text="'disable'"
          small
          class="mr-2"
          @click="disableUser(item._id)"
        />
        <v-icon
          v-else
          v-text="'restore'"
          small
          @click="restoreUser(item._id)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'users',
  data: () => ({
    dialog: false,
    inputNameError: '',
    inputEmailError: '',
    inputPasswordError: '',
    selectRoleError: '',
    headers: [
      {
        text: 'Role', align: 'left', value: 'role', sortable: false,
      },
      {
        text: 'Name', value: 'name', sortable: false,
      },
      {
        text: 'Email', value: 'email', sortable: false,
      },
      {
        text: 'Password', value: 'password', sortable: false,
      },
      {
        text: 'Actions', value: 'action', sortable: false,
      },
    ],
    isNewUser: true,
    roleSelectItems: [
      'administrator',
      'user',
      'salesperson',
    ],
    editedUser: {
      role: '',
      name: '',
      email: '',
      password: '',
    },
    defaultUser: {
      role: '',
      name: '',
      email: '',
      password: '',
    },
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    ...mapActions([
      'getUsers',
      'deleteUser',
      'editUser',
      'createUser',
      'disableUser',
      'restoreUser',
    ]),
    edit(user) {
      this.editedUser = Object.assign({}, user);
      this.isNewUser = false;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.isNewUser = true;
      }, 300);
    },
    save() {
      if (!this.editedUser.role) {
        this.selectRoleError = 'Required';
      }
      if (!this.editedUser.name) {
        this.inputNameError = 'Required';
      }
      if (!this.editedUser.email) {
        this.inputEmailError = 'Required';
      }
      if (!this.editedUser.password) {
        this.inputPasswordError = 'Required';
      }
      if (this.selectRoleError || this.inputNameError
          || this.inputEmailError || this.inputPasswordError
      ) {
        return;
      }
      if (!this.isNewUser) {
        this.close();
        this.editUser(this.editedUser);
        return;
      }

      this.close();
      this.editedUser.status = 'active';
      this.createUser({ user: this.editedUser, registration: false });
    },
    selectRole(value) {
      if (!value) {
        this.selectRoleError = 'Required';
        return;
      }
      this.selectRoleError = '';
    },
    inputName(value) {
      if (!value) {
        this.inputNameError = 'Required';
        return;
      }
      this.inputNameError = '';
    },
    inputEmail(value) {
      if (!value) {
        this.inputEmailError = 'Required';
        return;
      }
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!pattern.test(value)) {
        this.inputEmailError = 'Invalid e-mail';
        return;
      }
      this.inputEmailError = '';
    },
    inputPassword(value) {
      if (!value) {
        this.inputPasswordError = 'Required';
        return;
      }
      if (value.length < 6) {
        this.inputPasswordError = 'Min 6 characters';
        return;
      }
      this.inputPasswordError = '';
    },
    fetchData() {
      if (!this.isAdmin) {
        this.$router.push({ path: '/' });
        return;
      }
      this.getUsers();
    },
  },
  computed: {
    ...mapState([
      'users',
    ]),
    ...mapGetters([
      'isAdmin',
    ]),
  },
};
</script>

<style lang='sass'>
  .users
    padding-top: 50px
    &__items
      display: flex
      flex-wrap: wrap
      margin: 0 -20px
    &__item
      width: calc(25% - 40px)
      margin: 0 20px 40px
</style>
