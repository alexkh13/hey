import React from 'react';
import moment from 'moment';
import { Avatar as MaterialAvatar, Box } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { red, green } from '@material-ui/core/colors';

export default function Avatar({ profile, size, style, ...props }) {

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
        <MaterialAvatar src={profile.avatar} style={avatarStyle} />
    </Box>
}
