<template>
  <div class="account">
    <h2 v-text="'Your profile'"/>
    <h3 class="mt-10 mb-10" v-text="`Your name is: ${name}.`"/>
    <v-form v-if="changingPassword">
      <v-text-field
        counter
        required
        type="password"
        label="Old Password"
        placeholder="Password"
        :value="password"
        :error-messages="inputPasswordError"
        @input="inputPassword"
      />
      <v-text-field
        counter
        required
        type="password"
        label="New Password"
        placeholder="Password"
        :value="passwordNew"
        :error-messages="inputPasswordNewError"
        @input="inputPasswordNew"
      />
      <v-btn v-text="'Change Password'" class="mb-5" type="submit" @click="submitNewPassword"/>
    </v-form>
    <v-btn @click="showChangingPassword">
      <span v-if="!changingPassword" v-text="'Change Password'"/>
      <span v-else v-text="'Back'"/>
    </v-btn>
    <v-dialog v-model="passwordChanged" width="500">
      <v-card>
        <v-card-title v-text="'Congratulations'" primary-title class="headline grey lighten-2"/>
        <v-card-text v-text="'You password has been changed.'"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="'Ok'" @click="passwordChanged = false"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'account',
  data: () => ({
    changingPassword: false,
    password: '',
    passwordNew: '',
    inputPasswordError: '',
    inputPasswordNewError: '',
    passwordChanged: false,
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    ...mapActions([
      'changeUserPassword',
    ]),
    fetchData() {
      if (this.role !== 'user') {
        this.$router.push({ path: '/' });
      }
    },
    showChangingPassword() {
      this.changingPassword = !this.changingPassword;
    },
    inputPassword(value) {
      this.password = value;
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
    inputPasswordNew(value) {
      this.passwordNew = value;
      if (!value) {
        this.inputPasswordNewError = 'Required';
        return;
      }
      if (value.length < 6) {
        this.inputPasswordNewError = 'Min 6 characters';
        return;
      }
      this.inputPasswordNewError = '';
    },
    submitNewPassword() {
      if (!this.password) {
        this.inputPasswordError = 'Required';
      }
      if (!this.passwordNew) {
        this.inputPasswordNewError = 'Required';
      }
      if (this.password !== this.currentPassword) {
        this.inputPasswordError = 'Doesn\'t match current password';
      }
      if (this.password === this.passwordNew) {
        this.inputPasswordNewError = 'Passwords must be different';
      }
      if (this.inputPasswordError || this.inputPasswordNewError) {
        return;
      }
      this.passwordChanged = true;
      this.changeUserPassword({ id: this.id, password: this.passwordNew });
      this.password = '';
      this.passwordNew = '';

      this.changingPassword = false;
    },
  },
  computed: {
    ...mapGetters({
      id: 'id',
      name: 'name',
      currentPassword: 'password',
      role: 'role',
    }),
  },
};
</script>

<style lang='sass'>
  .account
    padding-top: 50px
    .v-input
      max-width: 400px
</style>
