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

        // Sort the sponsors in time order that they sponsored
        return sponsorList.sort((a,b) => {
          let aD = Date.parse(a);
          let bD = Date.parse(b);
          
          if (aD === bD)
            return 0;
          else if (aD > bD)
            return 1;
          else 
            return -1;
        });
      }
    }
  }

export default createEasyFirestore(sponsorsDataModule, {logging: true});
