import * as firebase from 'firebase';

var config = {
    apiKey: 'AIzaSyAIMSB1e-9QybBIIYx73Dru3ziHljvoB3g',
    authDomain: 'bad-correlation-finder.firebaseapp.com',
    databaseURL: 'https://bad-correlation-finder.firebaseio.com',
    projectId: 'bad-correlation-finder',
    storageBucket: 'bad-correlation-finder.appspot.com',
    messagingSenderId: '709733298123'
  };
firebase.initializeApp(config);

export const auth = firebase.auth();

export default firebase;
