import React from 'react';
import moment from 'moment';
import { Grid, Box, useTheme, Typography } from '@material-ui/core';
import Collection from './Collection';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Image from './Image';
import Avatar from './Avatar';
import NotificationToggle from './NotificationToggle';
import QRCode from './QRCode';

export default function Profile({ path, snapshot }) {

    const { profile } = snapshot.data();
    const avatarSize = 200;

    return <Grid container direction="column" alignItems="center" justify="center" style={{
        position: 'relative'
    }}>
        
        <Box style={{ height: '50vh', width: '100%' }}>
            <Image src={profile.background}/>
        </Box>

        <Box p={2} style={{ position: 'absolute', top: 0, right: 0 }}>
            <Grid container spacing={1}>
                <Grid item>
                    <NotificationToggle snapshot={snapshot}/>
                </Grid>
                <Grid item>
                    <QRCode/>
                </Grid>
            </Grid>
        </Box>
        
        <Box style={{ position: 'relative', marginBottom: -avatarSize/2, bottom: avatarSize/2 }}>
            <Avatar profile={profile} size={avatarSize} />
        </Box>
                    
        <Box mt={5} mb={5}>
            <Collection 
                snapshot={snapshot}
                parent={path}
                path="/messages"  
                query={{
                    orderBy: "createTime desc",
                    limit: 50
                }}>
                {snap => <Messages messages={snap.docs}/>}
            </Collection>
        </Box>

    </Grid>
}

function Messages({ messages }) {
    return <Grid container direction="column" alignItems="center" justify="center" spacing={2}>
        {messages.map(msg => <Grid key={msg.id} item>
            <Message data={msg.data()}/>
        </Grid>)}
    </Grid>
}

function Message({ data }) {
    const theme = useTheme();
    
    return <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
            <Typography variant="caption" color="textSecondary" gutterBottom>
                {data.createTime && moment(data.createTime.toDate()).fromNow()} 
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="body2" style={{
                background: theme.palette.primary.main,
                color: fade(theme.palette.primary.contrastText, data.text ? 1 : .5),
                borderRadius: theme.spacing(.5),
                padding: theme.spacing(1),
                margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
                maxWidth: 500
            }}>
                {data.text || "None"}
            </Typography>
        </Grid>
    </Grid>;
}