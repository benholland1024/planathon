<template>
  <div class="auth-popup" id="login">
    <h2>Login</h2>
    <p>Email:</p>
    <input v-model="email" type="text" />
    <p>Password:</p>
    <input v-model="password" type="password" /> <br><br>
    <button @click="signIn()" class="material-button-large purple-gradient">Login</button> <br><br>
    <p>Don't have an account yet?</p>
    <router-link to="/register" tag="h2" class="link light-purple faded-link">
      Register
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
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
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
