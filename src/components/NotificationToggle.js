import React from 'react';
import { useNotificationToggle } from '../firebase';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { Fab } from '@material-ui/core';

export default function NotificationToggle({ snapshot }) {

    const [subscribed, toggle] = useNotificationToggle({
        snapshot
    });

    return <Fab onClick={toggle} color={subscribed ? 'primary' : 'default'}>
        {subscribed ? <NotificationsActiveIcon/> : <NotificationsIcon/>}
    </Fab>
    
}