import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const user = firebase.auth().currentUser
const db = firebase.database()
const usersRef = db.ref('/users')
const postsRef = db.ref('/posts')
const provider = new firebase.auth.GoogleAuthProvider()

Vue.use(Vuex)

function createNewAccount(user) {
  return firebase.database().ref(`users/${user.uid}`).set({
    // displayName: user.displayName,
    displayName: user.displayName || user.email.split('@')[0], // use part of the email as a username
    email: user.email,
    uid: user.uid,
    image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
  })
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      post: null,
      users: [],
      posts: [],
    },
    getters: {
      isAuthenticated(state) {
        return !!state.user
      },
      currentUser: state => state.user,
      users: state => state.users,
      user: state => state.user
    },
    actions: {
      setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef('user', firebase.database().ref(path))
      }),
      resetUser({
        state
      }) {
        state.user = null
      },
      userCreate({ commit }, user) {
        return firebase.auth()
          .createUserWithEmailAndPassword(user.email, user.password)
          .then((result) => {
            console.log(result.user.uid)
            createNewAccount({
              ...result.user
            })
            return commit('setUser', result.user)
          })
      },
      userGoogleSignup({ commit }) {
        firebase.auth().useDeviceLanguage()
        provider.addScope('https://www.googleapis.com/auth/plus.login')
        provider.setCustomParameters({
          'login_hint': 'user@example.com'
        })
        return firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            createNewAccount({
              newImage: result.additionalUserInfo.profile.picture, // just use their existing user image to start
              ...result.user
            })
            this.isAuthenticated = true;
            return commit('setUser', result.user)
          }).catch((error) => {
            console.log(error)
          })
      },
      userGoogleLogin({ commit }) {
        firebase.auth().useDeviceLanguage()
        provider.addScope('https://www.googleapis.com/auth/plus.login')
        provider.setCustomParameters({
          'login_hint': 'user@example.com'
        })
        return firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            this.isAuthenticated = true;
            return commit('setUser', result.user)
          }).catch((error) => {
            console.log(error)
          })
      },
      userLogin({ state }, user) {
        return firebase.auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then((user) => {
            createNewAccount({
              newImage: result.additionalUserInfo.profile.picture, // just use their existing user image to start
              ...result.user
            })
            return state('setUser', user)
          })
      },
      userLogout({ state }) {
        return firebase.auth()
          .signOut()
          .then(() => {
            this.dispatch('resetUser')
          })
      },
      userUpdate({ state }, newData) {
        return firebase.database().ref(`users/${state.user.uid}`).update({
          displayName: newData.displayName
        })
      },
      userUpdateImage({ state }, image) {
        return firebase.database().ref(`users/${state.user.uid}`).update({
          image
        })
      },
      async SET_CREDENTIAL({ commit }, { user }) {
        if (!user) return
        await usersRef.child(user.email.replace('@', '_at_').replace(/\./g, '_dot_')).set({
          name: user.displayName,
          email: user.email,
          icon: user.photoURL
        })
        commit('setCredential', { user })
      },
      postReview( { state }, post) {
        db.ref(`${this.user.uid}/posts`).push ({ //setとの違いは？
          content: post.content,
          star: post.star
        })
      },
      async INIT_SINGLE({ commit }, { id }) {
        const snapshot = await postsRef.child(id).once('value')
        commit('savePost', { post: snapshot.val() })
      },
      INIT_USERS: firebaseAction(({ bindFirebaseRef }) => {
        bindFirebaseRef('users', usersRef)
      }),
      INIT_POSTS: firebaseAction(({ bindFirebaseRef }) => {
        bindFirebaseRef('posts', postsRef)
      }),
      ADD_POST: firebaseAction((ctx, { content, star }) => {
        postsRef.push({
          content: content,
          star: star
        })
      }),
    },
    mutations: {
      ...firebaseMutations,
      setUser(state, user) {
        state.user = user
        return this.dispatch('setAccountRef', `users/${user.uid}`)
      }
    },
  })
}

export default createStore
