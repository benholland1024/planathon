<template>
<div class="auth-popup" id="register">
  <h2>Register</h2>
  <p>Email:</p>
  <input v-model="email" type="text" />
  <p>Password:</p>
  <input v-model="password" type="password" /> <br><br>
  <button @click="signIn()" class="material-button-large purple-gradient">Register</button> <br><br>
  <p>Already have an account?</p>
  <router-link to="/login" tag="h2" class="link light-purple faded-link">
    Login
  </router-link>
</div>
</template>

<script>
import * as firebase from 'firebase';

export default {
    data() {
        return {
            email: "",
            password: ""
        }
    },
    methods: {
        signIn() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then((user) => {
                console.log(user);
            }).catch((error) => {
                throw error;
            });
        }
    }
 }
</script>

<style scoped lang="scss">

</style>
