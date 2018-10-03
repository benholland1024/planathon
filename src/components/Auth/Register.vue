<template>
<div class="auth-popup" id="register">
  <input v-model="email" type="text" />
  <input v-model="password" type="password" />
  <button @click="signIn()">Create</button>
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