
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";

import { useDocument } from "react-firebase-hooks/firestore";

import config from './firebase-config';
import { useState, useEffect } from 'react';

firebase.initializeApp(config);

export { firebase };

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const messaging = firebase.messaging();

export function getProjectID() {
    return config.projectId.replace("--", '-');
}

messaging.usePublicVapidKey("BGg07dNz7wHWhy_iaead1lf9tMEtnvT8gULAi4pBD1NrqqYTMOLJNjIOdFrOm9t4TL6Az6No0AU7gT-r6u8n16w");

auth.signInAnonymously().then(({user}) => {
    console.log(`signed in anonymously, uid ${user.uid}`);
});

export function useUser() {
    const [user, setUser] = useState(auth.currentUser);
    const [error, setError] = useState();

    useEffect(() => auth.onAuthStateChanged(setUser, setError), []);
    
    return [user, error];
}

export function useNotificationToggle({ snapshot }) {

    const [user] = useUser();
    const [subscribed, setSubscribed] = useState();

    const subscriptionRef = user && firestore.doc(`${snapshot.ref.path}/subscribers/${user.uid}`);

    const [ subscription, loadingSubcription ] = useDocument(subscriptionRef);

    const [loading, setLoading] = useState(loadingSubcription);

    const subscriptionData = subscription && subscription.data();

    useEffect(() => {
        if (!loadingSubcription && subscriptionData) {
            const { enabled } = subscriptionData;
            setSubscribed(enabled);
        }
        setLoading(loadingSubcription);
    }, [loadingSubcription, subscription, subscriptionData]);

    function setToken(token) {
        if (subscription.exists) {
            if (subscribed) {
                return subscriptionRef.update({
                    enabled: false,
                    tokens: firebase.firestore.FieldValue.arrayRemove(token)
                });
            } else {
                return subscriptionRef.update({
                    enabled: true,
                    tokens: firebase.firestore.FieldValue.arrayUnion(token)
                });
            }
        } else {
            return subscriptionRef.set({
                createdBy: user.uid,
                enabled: true,
                tokens: [token]
            });
        }
    }

    function setTokenError(err) {
        console.error(err);
        alert(err);
    }

    function toggle() {
        setLoading(true);
        messaging.getToken()
            .then(setToken, setTokenError)
            .finally(() => {
                setLoading(false);
            });
    }
    
    return [subscribed, loading, toggle];
}