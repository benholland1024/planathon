import createEasyFirestore from 'vuex-easy-firestore';

const tasksDataModule = {
    firestorePath: 'tasks',
    firestoreRefType: 'collection', // or 'doc'
    moduleName: 'tasks',
    statePropName: 'docs',

    getters: {
      hackathonTasks: (state) => (hackathonId) => {
        var hackathonTasks = []
        for (var key in state.docs) {
          if (state.docs.hasOwnProperty(key)) {
            if (state.docs[key].hackathon == hackathonId) {
              hackathonTasks.push(state.docs[key])
            }
          }
        }
        return hackathonTasks;
      }
    }

  }

export default createEasyFirestore(tasksDataModule, {logging: true});
