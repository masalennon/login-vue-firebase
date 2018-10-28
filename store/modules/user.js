import firebaseApp from '~/firebase/app'
import Cookies from 'js-cookie'
import { defaultCipherList } from 'constants';

export const state = () => ({
    uid: null,
    user: null
})

export const getters = {

    uid: state => {
        if (state.user && state.user.uid) return user.uid
        else return null
    },

    user: state => state.user,

    isAuthenticated: state => !!state.user && !!state.user.uid

}

export const actions = {

    async login({ dispatch, state }, user) {
        const token = await firebaseApp.auth().currentUser.getIdToken(true)
        const userInfo = {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            uid: user.uid
        }

        Cookies.set('access_token', token)
        await dispatch('setUSER', userInfo)
        await dispatch('saveUID', userInfo.uid)

    },

    async logout({ commit, dispatch }) {
        await firebaseApp.auth().signOut()

        Cookies.remove('access_token')
        commit('setUSER', null)
        commit('saveUID', null)
    },

    saveUID({ commit }, uid) {
        console.log('[STORE MUTATIONS] - saveUID:', uid)
        state.uid = uid
    },
    setUSER(state, user) {
        console.log('[STORE MUTATIONS] - setUSER:', user)
        state.user = user
    }
}

export const mutations = {
    saveUID(state, uid) {
        console.log('[STORE MUTATIONS] - saveUID:', uid)
        state.uid = uid
    },
    setUSER(state, user) {
        console.log('[STORE MUTATIONS] - setUSER:', user)
        state.user = user
    }
}