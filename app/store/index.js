import { getUserFromCookie, getUserFromSession} from '@/helpers'

export const actions = {

  async nuxtServerInit({ dispatch }, { req }) {
    let user = null
    if (process.server) { //process.browserだとリロードした時にloginに戻される・。。process.serverだとnuxt generateがエラーになる。nuxt generateとは？processとは？
      if (req !== undefined) { //this if statement is to prevent get error of 'unable to get headers of undefined'
        user = getUserFromCookie(req) //if分の中からのアクセスは可能。if文の中で宣言された場合、外からアクセスはできない。
      }
    }
    if (user) {
      await dispatch('modules/user/setUSER', {
        name: user.name,
        email: user.email,
        avatar: user.picture,
        uid: user.user_id
      })
    }
  }
}
