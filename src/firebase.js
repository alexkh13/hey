
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";

import { useDocument } from "react-firebase-hooks/firestore";

import config from './firebase-config';
import { useState, useEffect } from 'react';

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const messaging = firebase.messaging();

messaging.usePublicVapidKey("BGg07dNz7wHWhy_iaead1lf9tMEtnvT8gULAi4pBD1NrqqYTMOLJNjIOdFrOm9t4TL6Az6No0AU7gT-r6u8n16w");

auth.signInAnonymously();

export function useUser() {
    const [user, setUser] = useState(auth.currentUser);
    const [error, setError] = useState();

    useEffect(() => auth.onAuthStateChanged(setUser, setError), []);
    
    return [user, error];
}

export function useNotificationToggle({ snapshot }) {

    const [user] = useUser();
    const [subscribed, setSubscribed] = useState();

    const subscriptionRef = firestore.doc(`${snapshot.ref.path}/subscribers/${user.uid}`);

    const [ subscription, loading ] = useDocument(subscriptionRef);

    const subscriptionData = subscription && subscription.data();

    useEffect(() => {
        if (!loading && subscriptionData) {
            const { enabled } = subscriptionData;
            setSubscribed(enabled);
        }
    }, [loading, subscription, subscriptionData]);

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
        messaging.getToken().then(setToken, setTokenError);
    }
    
    return [subscribed, toggle];
}