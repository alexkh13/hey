import React from 'react';
import { Grid } from '@material-ui/core';
import Generic from './Generic';

export default function Layout({ match, snapshot, children, ...props }) {
    const style = {
        ...props.direction === 'column' && {
            width: "100%"
        }
    }
    return <Grid container wrap="nowrap" {...props} style={{...style,...props.style}}>
        {children.map((child, index) => <Grid key={index} style={style} item>
            <Generic match={match} snapshot={snapshot} def={child} disableLoading={true}/>
        </Grid>)}
    </Grid>
}