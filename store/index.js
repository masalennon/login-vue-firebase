import {
  getUserFromCookie,
  getUserFromSession
} from '@/helpers'

export const actions = {

  async nuxtServerInit({
    dispatch
  }, {
    req
    }) {
    console.log('serverinit')
    const user = getUserFromCookie(req)
    if (user) {
    console.log('serverinit, user hold success!!!')
      await dispatch('modules/user/setUSER', {
        name: user.name,
        email: user.email,
        avatar: user.picture,
        uid: user.user_id
      })
    }
  }
}
