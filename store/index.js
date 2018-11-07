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
    let user
    let test = 'a'
    if (process.server) {
      user = getUserFromCookie(req) //if分の中からのアクセスは可能。if文の中で宣言された場合、外からアクセスはできない。
    }
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
