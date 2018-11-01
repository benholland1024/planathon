import createEasyFirestore from 'vuex-easy-firestore';

const userDataModule = {
    firestorePath: 'users/{userId}',
    firestoreRefType: 'doc', // or 'doc'
    moduleName: 'userData',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(userDataModule, {logging: true});