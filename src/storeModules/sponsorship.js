import createEasyFirestore from 'vuex-easy-firestore';

const usersDataModule = {
    firestorePath: 'sponsors',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'sponsors',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(usersDataModule, {logging: true});
