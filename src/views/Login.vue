<template>
  <div class="login">
    <h2 v-text="'Sign In'"/>
    <v-form v-if="!ifForgotPassword">
      <v-text-field
        required
        type="text"
        label="Your Name"
        placeholder="Name"
        :value="name"
        :error-messages="inputNameError"
        @input="inputName"
      />
      <v-text-field
        counter
        required
        type="password"
        label="Your Password"
        placeholder="Password"
        :value="password"
        :error-messages="inputPasswordError"
        @input="inputPassword"
      />
      <v-btn v-text="'Sign In'" type="submit" @click="submitLogin"/>
    </v-form>
    <v-form v-else>
      <v-text-field
        required
        type="email"
        label="Your Email"
        placeholder="user@mail.com"
        :value="email"
        :error-messages="inputEmailError"
        @input="inputEmail"
      />
      <v-btn v-text="'Restore password'" type="submit" @click="submitRestorePass"/>
    </v-form>
    <v-btn class="mt-5" @click="ifForgotPassword = !ifForgotPassword">
      <span v-if="!ifForgotPassword" v-text="'Forgot password'"></span>
      <span v-else v-text="'Back'"></span>
    </v-btn>
    <v-dialog width="500" v-model="showPasswordRestored">
      <v-card>
        <v-card-title v-text="'Congratulations'" primary-title class="headline grey lighten-2"/>
        <v-card-text v-text="'You password has been sent. Check your email.'"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="'Ok'" @click="showLoginForm"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'login',
  data: () => ({
    ifForgotPassword: false,
    showPasswordRestored: false,
    name: '',
    password: '',
    email: '',
    inputNameError: '',
    inputEmailError: '',
    inputPasswordError: '',
  }),
  methods: {
    ...mapActions([
      'restoreUserPassword',
      'userLogin',
    ]),
    async submitRestorePass() {
      if (!this.email) {
        this.inputEmailError = 'Required';
      }
      if (this.inputEmailError) {
        return;
      }
      await this.restoreUserPassword(this.email);
      if (!this.error) {
        this.email = '';
        this.showPasswordRestored = true;
      }
    },
    submitLogin() {
      if (!this.name) {
        this.inputNameError = 'Required';
      }
      if (!this.password) {
        this.inputPasswordError = 'Required';
      }
      if (this.inputNameError || this.inputPasswordError) {
        return;
      }
      this.userLogin({ name: this.name, password: this.password });
    },
    inputName(value) {
      this.name = value;
      if (!value) {
        this.inputNameError = 'Required';
        return;
      }
      this.inputNameError = '';
    },
    inputEmail(value) {
      this.email = value;
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
    showLoginForm() {
      this.showPasswordRestored = false;
      this.ifForgotPassword = false;
    },
  },
  computed: {
    ...mapState([
      'error',
    ]),
  },
};
</script>

<style lang='sass'>
  .login
    padding-top: 50px
    .v-input
      max-width: 400px
</style>
