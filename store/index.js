import Vue from 'vue'
import Vuex from 'vuex'
import firebaseApp from '~/firebase/app'
import firebase from 'firebase'
import { getUserFromCookie, getUserFromSession } from '@/helpers'

import { firebaseMutations, firebaseAction } from 'vuexfire'
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from "js-cookie";


const db = firebaseApp.database()
const usersRef = db.ref('/users')
const postsRef = db.ref('/posts')
const tipsRef = db.ref('/tips')

Vue.use(Vuex)

function createNewAccount(user) {
  console.log(user)
  return firebaseApp.database().ref(`users/${user.uid}`).set({
    // displayName: user.displayName,
    displayName: user.displayName || user.email.split('@')[0], // use part of the email as a username
    email: user.email,
    uid: user.uid,
    imageUrl: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
  })
}


const createStore = () => {
  return new Vuex.Store({
    actions: {
      // createTip({commit}, payload) {

      // },
      async nuxtServerInit({ dispatch }, { req }) {
        const user = getUserFromCookie(req)
        if (user) {
          await dispatch('modules/user/setUser', {
            name: user.name,
            email: user.email,
            avatar: user.picture,
            uid: user.user_id
          })
        }

        if (firebaseApp.auth().currentUser) {
          commit('setUser', firebaseApp.auth().currentUser)
        } else console.log('this is nuxtServerInit. User is null!')
      },
      setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef('user', firebaseApp.database().ref(path))
      }),
      updateUserProfile () {

      },
      resetUser({
        state
      }) {
        state.user = null
      },
      postTip({ commit }, tip) {
        var newPostKey = tipsRef.push().key
        tip.key = newPostKey
        var updates = {}
        updates['tips/' + newPostKey] = tip
        updates['users/' + this.state.user.uid + '/' + newPostKey] = tip
        firebaseApp.database().ref().update(updates)
        return commit('setUser', this.state.user)
      },
      userCreate({ commit }, user) {
        return firebaseApp.auth()
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
        firebaseApp.auth().useDeviceLanguage()
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/plus.login')
        provider.setCustomParameters({
          'login_hint': 'user@example.com'
        })
        return firebaseApp.auth()
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
      async userGoogleLogin({ commit }) {
        firebaseApp.auth().useDeviceLanguage()
        provider.addScope('https://www.googleapis.com/auth/plus.login')
        provider.setCustomParameters({
          'login_hint': 'user@example.com'
        })
        return firebaseApp.auth()
          .signInWithPopup(provider)
          .then((result) => {
            const token = firebaseApp.auth().currentUser.getIdToken(true)
            return commit('setUser', result.user)
          }).catch((error) => {
            console.log(error)
          })
      },
      userLogin({ commit }, user) {
        return firebaseApp.auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then((result) => {
            this.isAuthenticated = true;
            return commit('setUser', result.user)
          })
      },
      userLogout({ state }) {
        return firebaseApp.auth()
          .signOut()
          .then(() => {
            this.dispatch('resetUser')
          })
      },
      userUpdate({ state }, newData) {
        return firebaseApp.database().ref(`users/${state.user.uid}`).update({
          displayName: newData.displayName
        })
      },
      userUpdateImage({ state }, image) {
        return firebaseApp.database().ref(`users/${state.user.uid}`).update({
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
        const uid = firebaseApp.auth().currentUser.uid
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
      setUser: state => { state.user = firebaseApp.auth().currentUser; },

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

      return firebaseApp.database().ref().update(updates);
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
