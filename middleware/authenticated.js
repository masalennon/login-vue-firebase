import firebaseApp from '~/firebase/app'

export default function ({
  store,
  redirect
  //A middleware accepts the context as it first argument. So we extract store and redirect from the context.
}) {
    // ユーザーが認証されていないとき
  // let user = firebase.auth().currentUser
  // store.state.user = user
  if (!store.getters['index/isAuthenticated']) {
    console.log('redirect')
    return redirect('/login')
  }
}
