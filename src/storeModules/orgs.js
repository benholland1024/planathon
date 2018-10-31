import createEasyFirestore from 'vuex-easy-firestore';

const orgsDataModule = {
    firestorePath: 'orgs',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'orgs',
    statePropName: 'docs',
    // you can also add state/getters/mutations/actions
    // for other config like fillables see 'Extra features'
  }

export default createEasyFirestore(orgsDataModule, {logging: true});
