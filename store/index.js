import {
  getUserFromCookie,
  getUserFromSession
} from '@/helpers'
import { getters } from "./modules/user.js"

export default {
  getters: getters
}
export const actions = {

  async nuxtServerInit({
    dispatch
  }, {
    req
  }) {
    const user = getUserFromCookie(req)
    if (user) {
      console.log('user is stored in cookie')
      await dispatch('modules/user/setUSER', {
        name: user.name,
        email: user.email,
        avatar: user.picture,
        uid: user.uid
      })
    }
  }
}
