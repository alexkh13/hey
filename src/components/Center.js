import React from 'react';
import { Grid } from '@material-ui/core';

export default function Center(props) {
    return <Grid 
        container
        direction="column"
        alignItems="center"
        justify="center"
        className="fill"
        {...props}/>
}