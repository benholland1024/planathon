import createEasyFirestore from 'vuex-easy-firestore';

const tasksDataModule = {
    firestorePath: 'tasks',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'tasks',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(tasksDataModule, {logging: true});
