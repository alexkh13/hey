import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useUser } from '../firebase';
import { getCollection } from './Generic';
import { messaging } from '../firebase';

export default function SubscribeButton({ snapshot, collectionName, ...props }) {

    const [user] = useUser();

    collectionName = collectionName || "subscribers";

    const colRef = getCollection(snapshot, collectionName)

    const subscriptionRef = user && colRef.doc(user.uid);

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
                await messaging.getToken()
                    .then(async (token) => subscriptionRef.set({
                        createdBy: user.uid,
                        tokens: [token],
                        name
                    }))
                    .catch((err) => {
                        console.error(err);
                        alert(err);
                    })
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