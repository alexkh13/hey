import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { Avatar as MaterialAvatar, Box, makeStyles } from '@material-ui/core';
import AvatarIcon from '@material-ui/icons/AccountBox';
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

export default function Avatar({ profile = {}, size, style, ...props }) {

    const classes = useStyle();

    const avatarStyle = {
        width: size,
        height: size
    };

    const presenseTimeout = get(profile, 'presence.timeout');
    const presenceLastUpdate = get(profile, 'presence.lastUpdate', {
        toDate: () => new Date()
    });

    const offline = moment().subtract(presenseTimeout, 'seconds').isAfter(presenceLastUpdate.toDate());

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
        <MaterialAvatar 
            src={profile.avatar} 
            style={avatarStyle} 
            children={!profile.avatar && <AvatarIcon style={{ width: size/2, height: size/2}}/>} />
    </Box>
}
