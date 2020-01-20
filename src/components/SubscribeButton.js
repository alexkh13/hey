import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useUser, firestore } from '../firebase';

export default function SubscribeButton({ snapshot, collectionName, ...props }) {

    const [user] = useUser();

    collectionName = collectionName || "subscribers";

    const subscriptionRef = user && firestore.doc(`${snapshot.path || snapshot.ref.path}/${collectionName}/${user.uid}`);

    const [ subscription, loadingSubcription ] = useDocument(subscriptionRef);

    const [loading, setLoading] = useState(loadingSubcription);

    const {
        subscribeText = "Subscribe",
        unsubscribeText = "Unsubscribe"
    } = props;

    const isSubscribed = subscription && subscription.exists;

    const buttonText = isSubscribed ? unsubscribeText: subscribeText;

    useEffect(() => {
        setLoading(loadingSubcription);
    }, [loadingSubcription]);

    async function toggle() {
        setLoading(true);
        if (isSubscribed) {
            await subscriptionRef.delete();
        } else {
            const name = user.displayName || prompt("What's your name?");
            if (name) {
                if (user.isAnonymous) {
                    localStorage.setItem("anonDisplayName", name); 
                }
                await subscriptionRef.set({
                    createdBy: user.uid,
                    name,
                });
            }
        }
        setLoading(false);
    }

    return <Button 
        onClick={toggle} 
        disabled={loading} 
        color={isSubscribed ? 'secondary' : 'primary'}
        variant="contained">
        {buttonText}
    </Button>
}