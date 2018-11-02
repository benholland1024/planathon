import createEasyFirestore from 'vuex-easy-firestore';

const orgsDataModule = {
    firestorePath: 'orgs',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'orgs',
    statePropName: 'docs',

    getters: {
      userOrgs: (state) => (userId) => {
        var userOrgs = []
        for (var key in state.docs) {
          //console.warn(state.docs[key])
          if (state.docs.hasOwnProperty(key)) {
            if (state.docs[key].collaborators.includes(userId)) {
              console.log("User ID: ", userId);
              console.log("Is it included? ", )
              userOrgs.push(state.docs[key])
            }
          }
        }
        return userOrgs
      }
    }
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(orgsDataModule, {logging: true});
