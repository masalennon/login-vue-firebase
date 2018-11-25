import firebaseApp from '~/firebase/app'
function auth () {
  return new Promise((resolve, reject) => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      resolve(user || false)
    })
  })
}
export default auth
