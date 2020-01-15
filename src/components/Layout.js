import React from 'react';
import { Grid } from '@material-ui/core';
import Generic from './Generic';

export default function Layout({ snapshot, children, ...props }) {
    return <Grid container {...props}>
        {children.map((child, index) => <Grid key={index} item>
            <Generic snapshot={snapshot} def={child}/>
        </Grid>)}
    </Grid>
}