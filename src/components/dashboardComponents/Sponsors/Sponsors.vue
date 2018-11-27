<template>
  <div class="widget-holder">
    <div class="dark-widget">
      <div class="search-bar">
        <img src="@/assets/search.png" class="icon" >
        <input v-model="companySearchText"  />
      </div>
      <sponsor-editor :sponsor="sponsorToAdd" id="sponsToAdd"></sponsor-editor>
      <button value="Add" @click="addSponsor"
        class="material-button-large gray-button">Add a new sponsor!</button>
      <div v-for="(sponsor, index) in filteredSponsorList" :key="index">
        <sponsor-editor :sponsor="sponsor" :hackathonId="$parent.hackathon.id"></sponsor-editor>
      </div>
    </div>
    <div class="dark-widget">
      <funding-burndown :hackathonId="$parent.hackathon.id"></funding-burndown>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';
import SponsorEditor from '@/components/dashboardComponents/Sponsors/SponsorEditor.vue';
import { Sponsor } from '@/components/dashboardComponents/Sponsors/Sponsor.js'
import FundingBurndown from '@/components/dashboardComponents/Sponsors/FundingBurndown.vue'

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
      this.sponsorToAdd = Sponsor(this.$parent.hackathon.id, 'Company Name')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

#sponsToAdd {
  background-color: $gray;
  box-shadow: $box-shading;
}
.dark-widget {
  overflow-y: scroll;
}

.search-bar {
  display: flex; 
  align-items:center; 
  justify-content: center;
  margin: 20px;
  input {
    background: none;
    outline: none;
    border: none;
    border-bottom: solid 3px $lighter-gray;
    color: $lighter-gray;
    font-size: 20px;
  }
}
</style>
