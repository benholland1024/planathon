import createEasyFirestore from 'vuex-easy-firestore';

const hackathonsDataModule = {
    firestorePath: 'hackathons',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'hackathons',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(hackathonsDataModule, {logging: true});
