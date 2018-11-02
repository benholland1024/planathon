<template>
    <form @submit.prevent="saveSponsor">
        <label for="hackid" >HackID</label><input v-model="sponsor.hackathonId" id="hackid"/><br>
        <label for="company" >Company</label><input v-model="sponsor.company" id="company"/><br>
        <h3>Contacts</h3>
        <div v-for="contact in sponsor.contacts" 
                v-bind:key="contact.email">
            <label for="contactName" >Name</label><input v-model="contact.name" id="contactName" /><br>
            <label for="contactEmail" >Email</label><input v-model="contact.email" id="contactEmail" /><br>
            <label for="contactNotes" >Notes</label><input v-model="contact.notes" id="contactNotes"/><br><br>
        </div>
        <input type="button" @click="newContact" value="Add Contact"/><br>
        Interactions
        <div v-for="(interaction, index) in sponsor.interactions"
                :key="index">
            <input type="date" v-model="interaction.occurred" /><br>
            Notes<textarea v-model="interaction.notes" /><br>
        </div><br>
        <input type="button" @click="newInteraction" value="Add Interaction"/><br>
        <label for="sponsAmt" >Amount</label><input type="number" v-model="sponsor.sponsored.amount" id="sponsAmt"/><br>
        <label for="sponsComitted" >Date Committed</label><input type="date" v-model="sponsor.sponsored.dateCommitted" id="sponsCommitted"/><br>
        <label for="sponsPaid" >Date Paid</label><input type="date" v-model="sponsor.sponsored.datePaid" id="sponsPaid"/><br>
        <input type="button" @click="watchThisSponsor" value="Watch" />
        <input type="submit" value="Save"/>
    </form>
</template>

<script>
import { Sponsor, Contact, Interaction } from './Sponsor'

export default {

    props: {
        sponsor: {
            type: Object,
            default: function() {
                return Sponsor();
            }
        }
    },
    methods: {
        async saveSponsor() {
            await this.$store.dispatch('sponsors/set', this.sponsor);
        },
        newContact() {
            this.sponsor.contacts.push(Contact())
        },
        newInteraction() {
            this.sponsor.interactions.push(Interaction())
        },
        watchThisSponsor() {
            this.sponsor.watchers.push(
                this.$parent.$parent.$parent.userId
            );
        }
    }
}
</script>

<style>

</style>

