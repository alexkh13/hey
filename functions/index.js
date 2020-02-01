const functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
    admin.initializeApp(functions.config().firebase);
} 
catch (e) {
    console.error('Caught error initializing app with functions.config():', e.message || e);
}

const firestore = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.hub = functions.firestore
    .document('/hubs/{hubId}/{col}/{messageId}')
    .onCreate(collectionCreate)

async function collectionCreate(snap, context) {
    const { hubId } = context.params || {}
    const documentData = snap.data()

    const rootPath = `hubs/${hubId}`;

    if (!documentData) {
        console.log(`"${rootPath}" no data`);
        return null;
    }

    const hub = await firestore.doc(rootPath).get();

    const { subColName = "subscribers" } = hub.data() || {};

    const collectionPath = `${rootPath}/${subColName}`;

    const subscribersPromise = (() => {
        if (documentData[subColName]) {
            const docs = documentData[subColName].map(subscriberId => firestore.doc(`${collectionPath}/${subscriberId}`));
            return firestore.getAll(...docs);
        } else {
            return firestore.collection(collectionPath).get().then(s => s.docs);
        }
    })();

    return subscribersPromise.then(async subscribers => {

        return Promise.all(subscribers.map(async subscriber => {

            const subscriberData = subscriber.data();

            if (!subscriberData) {
                console.log(`"${subscriber.ref.path}" no data`)
                return null
            }

            if (!subscriberData.tokens) {
                console.log(`"${subscriber.ref.path}" no data.tokens`)
                return null
            }

            return Promise.all(subscriberData.tokens.map(token => {
                return admin.messaging().sendToDevice(token, {
                    notification: {
                        title: 'Incoming message',
                        body: documentData.text
                    }
                });
            }));

        }));
        
    });
}
