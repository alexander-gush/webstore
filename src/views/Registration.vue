<template>
  <div class="registration">
    <h2>Registration</h2>
    <v-form ref="form">
      <v-text-field
        required
        label="Your name"
        placeholder="Login"
        :value="name"
        :error-messages="inputNameError"
        @input="inputName"
      />
      <v-text-field
        required
        type="email"
        label="Your Email"
        placeholder="user@mail.com"
        :value="email"
        :error-messages="inputEmailError"
        @input="inputEmail"
      />
      <v-text-field
        counter
        required
        type="password"
        label="Your Password"
        placeholder="Password"
        :error-messages="inputPasswordError"
        :value="password"
        @input="inputPassword"
      />
      <v-btn v-text="'Register'" type="submit" @click="submitRegister"/>
    </v-form>
    <v-dialog v-model="registered" width="500">
      <v-card>
        <v-card-title v-text="'Congratulations'" primary-title class="headline grey lighten-2"/>
        <v-card-text v-text="'You have just successfully registered!'"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="'Go to Sign In'" @click="goToLogin"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'registration',
  data: () => ({
    registered: false,
    name: '',
    email: '',
    password: '',
    inputNameError: '',
    inputEmailError: '',
    inputPasswordError: '',
  }),
  methods: {
    ...mapActions([
      'createUser',
    ]),
    async submitRegister() {
      if (!this.name) {
        this.inputNameError = 'Required';
      }
      if (!this.email) {
        this.inputEmailError = 'Required';
      }
      if (!this.password) {
        this.inputPasswordError = 'Required';
      }
      if (this.inputNameError || this.inputEmailError || this.inputPasswordError) {
        return;
      }
      await this.createUser({
        user: {
          role: 'user',
          name: this.name,
          email: this.email,
          password: this.password,
          status: 'active',
        },
        registration: true,
      });
      this.name = '';
      this.email = '';
      this.password = '';
      this.registered = true;
    },
    goToLogin() {
      this.$router.push({ path: '/login' });
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
  },
};
</script>

<style lang='sass'>
  .registration
    padding-top: 50px
    .v-input
      max-width: 400px
</style>
