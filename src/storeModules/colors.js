import createEasyFirestore from 'vuex-easy-firestore';

const tasksDataModule = {
    firestorePath: 'colors',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'colors',
    statePropName: 'docs',

    getters: {
      hackathonColors: (state) => (hackathonId) => {
        var colors = []
        for (var key in state.docs) {
          if (state.docs.hasOwnProperty(key)) {
            if (state.docs[key].hackathon == hackathonId) {
                colors.push(state.docs[key])
            }
          }
        }
        return colors;
      }
    }

  }

export default createEasyFirestore(tasksDataModule, {logging: true});
