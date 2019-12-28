import React from 'react';
import moment from 'moment';
import { Avatar as MaterialAvatar, Box, makeStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { red, green } from '@material-ui/core/colors';

const useStyle = makeStyles(() => ({
    greenPulse: {
        animation: 'green-sonar-effect 4s ease-in-out .1s infinite',
        content: '',
        display: 'inline-block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        top: 0,
        left: 0
    },
    redPulse: {
        animation: 'red-sonar-effect 1s ease-in-out .1s infinite',
        content: '',
        display: 'inline-block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        top: 0,
        left: 0
    }
}));

export default function Avatar({ profile, size, style, ...props }) {

    const classes = useStyle();

    const avatarStyle = {
        width: size,
        height: size
    };

    const offline = moment().subtract(profile.presence.timeout, 'seconds').isAfter(profile.presence.lastUpdate.toDate());

    return <Box boxShadow={3} style={{
            position: 'relative',
            zIndex: 100,
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: fade(offline ? red[500] : green[500], 0.5),
            borderRadius:'50%',
            ...style
        }} {...props}>    
        <div className={offline ? classes.redPulse : classes.greenPulse}/>
        <MaterialAvatar src={profile.avatar} style={avatarStyle} />
    </Box>
}
