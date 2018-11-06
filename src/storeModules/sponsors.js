import createEasyFirestore from 'vuex-easy-firestore';

const sponsorsDataModule = {
    firestorePath: 'sponsors',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'sponsors',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'

    getters: {
      hackathonSponsors: (state) => (hackId) => {
        let sponsorList = [];

        for (let sponsObj in state.docs) {
          if (state.docs.hasOwnProperty(sponsObj))
          if (state.docs[sponsObj].hackathonId === hackId) {
            sponsorList.push(state.docs[sponsObj]);
          }
        }
        return sponsorList;
      }
    }
  }

export default createEasyFirestore(sponsorsDataModule, {logging: true});
