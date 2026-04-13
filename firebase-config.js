const firebaseConfig = {
    apiKey: "AIzaSyB2S84pJWcXwbKRo9gOx9dKIU2gWDmerHs",
    authDomain: "car-info-9288d.firebaseapp.com",
    projectId: "car-info-9288d",
    storageBucket: "car-info-9288d.firebasestorage.app",
    messagingSenderId: "94709855714",
    appId: "1:94709855714:web:8b6d82c971daf4617bf5bb"
};

if (typeof firebase !== "undefined") {
    const firebaseApp = firebase.initializeApp(firebaseConfig);

    window.firebaseApp = firebaseApp;
    window.carInfoFirebase = {
        app: firebaseApp,
        config: firebaseConfig
    };
} else {
    console.error("Firebase SDK failed to load.");
}