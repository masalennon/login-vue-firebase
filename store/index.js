import Vuex from 'vuex'
import firebase from 'firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'

function createNewAccount (account) {
  return firebase.database().ref(`accounts/${account.uid}`).set({
    // displayName: account.displayName,
    displayName: account.displayName || account.email.split('@')[0], // use part of the email as a username
    email: account.email,
    image: account.newImage || '/images/default-profile.png' // supply a default profile image for all users
  })
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: {},
      account: {}
    },
    getters: {
      isAuthenticated (state) {
        return !!state.user
      }
    },
    actions: {
      setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef('account', firebase.database().ref(path))
      }),
    resetUser ({
      state
    }) {
    state.user = null
  },
  userCreate ({ state }, account) {
    return firebase.auth()
      .createUserWithEmailAndPassword(account.email, account.password).then((result) => {
        console.log(result.user.uid)
        createNewAccount(
          result.user
      )
      // .then((user, result) => {
      // createNewAccount(user)
      //   commit('setUser', result.user)
    // })
  })},
  userGoogleLogin ({ commit }) {
    firebase.auth().useDeviceLanguage()
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')
    provider.setCustomParameters({
      'login_hint': 'user@example.com'
    })
    return firebase.auth()
      .signInWithPopup(provider)
      .then((result) =>
      {
      // createNewAccount({
      //                    newImage: result.additionalUserInfo.profile.picture, // just use their existing user image to start
  // ...result.user
  // })
    return commit('setUser', result.user)
  }).catch((error) => {
      console.log(error)
  })
  },
  userLogin ({ state }, account) {
    return firebase.auth()
      .signInWithEmailAndPassword(account.email, account.password)
      .then((user) => {
      return this.dispatch('setUser', user)
    })
  },
  userLogout ({ state }) {
    return firebase.auth()
      .signOut()
      .then(() => {
      this.dispatch('resetUser')
  })
  },
  userUpdate ({ state }, newData) {
    return firebase.database().ref(`accounts/${state.user.uid}`).update({
      displayName: newData.displayName
    })
  },
  userUpdateImage ({ state }, image) {
    return firebase.database().ref(`accounts/${state.user.uid}`).update({
      image
    })
  }
},
  mutations: {
  ...firebaseMutations,
      setUser (state, user) {
      state.user = user
      return this.dispatch('setAccountRef', `accounts/${state.user.uid}`)
    }
  }
})
}

export default createStore
