import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from "js-cookie";


const db = firebase.database()
const usersRef = db.ref('/users')
const postsRef = db.ref('/posts')
const provider = new firebase.auth.GoogleAuthProvider()

Vue.use(Vuex)

function createNewAccount(user) {
  console.log(user)
  return firebase.database().ref(`users/${user.uid}`).set({
    // displayName: user.displayName,
    displayName: user.displayName || user.email.split('@')[0], // use part of the email as a username
    email: user.email,
    uid: user.uid,
    imageUrl: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
  })
}

const createStore = () => {
  return new Vuex.Store({
    plugins: [
      createPersistedState({
        storage: {
          getItem: key => Cookies.get(key),
          // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
          setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
          removeItem: key => Cookies.remove(key)
        }
      })
    ],
    state: {
      user: null,
      post: null,
      users: [],
      posts: [],
      userName: ''
    },
    getters: {
      isAuthenticated(state) {
        return !!state.user
      },
      currentUser: state => state.user,
      users: state => state.users,
      user: state => state.user,
      userName: state => state.userName,
      email: state => state.user.email
    },
    actions: {
      // createTip({commit}, payload) {

      // },
      setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef('user', firebase.database().ref(path))
      }),
      updateUserProfile () {

      },
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
            return commit('setUser', user)
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
      userLogin({ commit }, user) {
        return firebase.auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then((result) => {
            this.isAuthenticated = true;
            return commit('setUser', result.user)
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
        const uid = firebase.auth().currentUser.uid
        db.ref(`/posts/${uid}`).push ({ //setとの違いは？
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
      setUser: ({ commit }) => { commit('setUser') },
      // setName: ({ commit }) => { commit('setName') },
      updateProfile: ({ commit }) => {commit('updateProfile')}
    },
    mutations: {
      ...firebaseMutations,
      setUser2(state, user) {
        state.user = user
        return this.dispatch('setAccountRef', `users/${user.uid}`)
      },
      setUser: state => { state.user = firebase.auth().currentUser; },

      updateProfile: ({state},{user}) => {
      // return state.user.updateUserProfile({
      //   displayName: user.displayName
      // })
      var postData = {
        displayName: user.username,
        // body: body,
        // title: title,
        // starCount: 0,
        // authorPic: picture
      };
      console.log(displayName)
      console.log(user.username)

      var updates = {};
      // updates['/posts/' + newPostKey] = postData;
      updates['/user-posts/' + state.user.uid] = postData;

      return firebase.database().ref().update(updates);
    }


    },
    plugins: [
      createPersistedState({
          storage: {
              getItem: key => Cookies.get(key),
              setItem: (key, value) => Cookies.set(key, value, {
                  expires: 3,
                  secure: false
              }),
              removeItem: key => Cookies.remove(key)
          }
      })
    ]
  })
}

export default createStore
