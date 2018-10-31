import createEasyFirestore from 'vuex-easy-firestore';

const sponsorshipDataModule = {
    firestorePath: 'sponsorship',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'sponsorship',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(sponsorshipDataModule, {logging: true});
