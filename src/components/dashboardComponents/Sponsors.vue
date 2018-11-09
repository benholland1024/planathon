<template>
  <div class="widget-holder">
    <div class="dark-widget">
      <input v-model="companySearchText" />
      <sponsor-editor :sponsor="sponsorToAdd" id="sponsToAdd"></sponsor-editor>
      <button value="Add" @click="addSponsor"/>
      <div v-for="(sponsor, index) in filteredSponsorList" :key="index">
        <sponsor-editor :sponsor="sponsor"></sponsor-editor>
      </div>
    </div>
    <div class="dark-widget">
      <funding-burndown :hackathonId="$parent.hackathon.id"></funding-burndown>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';
import SponsorEditor from '@/components/Sponsorship/SponsorEditor.vue';
import { Sponsor } from '@/components/Sponsorship/Sponsor.js'
import FundingBurndown from '@/components/Sponsorship/FundingBurndown.vue'

export default {
  name: 'development',
  components: {
    Tasks,
    SponsorEditor,
    FundingBurndown
  },
  data() {
    return {
      companySearchText: '',
      sponsorToAdd: {}
    }
  },
  computed: {
    sponsorList() {
      return this.$store.getters['sponsors/hackathonSponsors'](
        this.$parent.hackathon.id
      );
    },
    filteredSponsorList() {
      return this.sponsorList.filter(spons => 
        spons.company
        .toLowerCase()
        .includes(this.companySearchText.toLowerCase())
      );
    }
  },
  methods: {
    addSponsor() {
      console.log('test')
      this.sponsorToAdd = Sponsor(this.$parent.hackathon.id, '<new>')
    }
  }
}
</script>

<style>
#sponsToAdd {
  background-color: green;
}
</style>
