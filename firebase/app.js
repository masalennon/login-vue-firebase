import firebase from 'firebase'

const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
}

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
export { googleProvider, facebookProvider, twitterProvider }
