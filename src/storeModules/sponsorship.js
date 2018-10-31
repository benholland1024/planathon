import createEasyFirestore from 'vuex-easy-firestore';

const usersDataModule = {
    firestorePath: 'users',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'users',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(usersDataModule, {logging: true});
