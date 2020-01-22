import React from 'react';
import { Grid } from '@material-ui/core';
import Generic from './Generic';

export default function Layout({ match, snapshot, children, ...props }) {
    return <Grid container wrap="nowrap" {...props}>
        {children.map((child, index) => <Grid key={index} item>
            <Generic match={match} snapshot={snapshot} def={child} disableLoading={true}/>
        </Grid>)}
    </Grid>
}