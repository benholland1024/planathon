<template>
<div>
    <h2>Add sponsor</h2>
    <form @submit.prevent="addSponsor">
        <input type="text" v-model="newSponsor.company" placeholder="Company Name"/><br>
        <input type="text" v-model="newSponsor.contact.name" placeholder="Contact Name" /><br>
        <input type="email" v-model="newSponsor.contact.email" placeholder="Contact Email" /><br>
        <input type="submit" />
    </form>

    <input type="button" @click="testImport" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase';
import Sponsor from './Sponsor';
const Timestamp = firebase.firestore.Timestamp;

export default Vue.extend({
    data() {
        return {
            newSponsor: {
                company: '',
                contact: {
                    name: '',
                    email: ''
                }
            }
        }
    },
    mounted: () => {
        console.log("ContactTracker")
    },
    methods: {
        addSponsor: async function() {

            console.log(this.newSponsor)

            let sponsor = Sponsor.createSponsor(
                'jkVV4jCvDWwAzx9OiAHn',
                this.newSponsor.company,
                this.newSponsor.contact.name,
                this.newSponsor.contact.email
            );

            // Add the creator to the list of people 
            // watching for events.
            sponsor.watchers.push(this.$parent.user.id);

            let result = await this.$parent.db
                .collection('sponsors')
                .add(sponsor)
            console.log(result)
        },

        testImport: async function() {
            await Sponsor.importSponsors(
                this.$parent.db,
                'lFazEee7vhrO1oWg9r59',
                'jkVV4jCvDWwAzx9OiAHn',
                this.$parent.user.id
            );
        }
    }
})
</script>

<style>

</style>