import firebase from 'firebase/app'
// import firebase from 'firebase/auth'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD-3ymeexAgp9ZxMOoraQHucAjPlXf1WBY',
    authDomain: 'beauty-f7d86.firebaseapp.com',
    databaseURL: 'https://beauty-f7d86.firebaseio.com',
    projectId: 'beauty-f7d86',
    storageBucket: 'beauty-f7d86.appspot.com',
    messagingSenderId: '939466198000'

  })
}

export default firebase
