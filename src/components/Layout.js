import React from 'react';
import { Grid } from '@material-ui/core';
import Generic from './Generic';

export default function Layout({ children, style, ...props }) {
    const itemStyle = {
        ...props.direction === 'column' && {
            width: "100%"
        }
    }
    return <Grid container wrap="nowrap" {...props} style={style}>
        {children.map(({ layoutItem, ...child }, index) => <Grid key={index} style={itemStyle} item {...layoutItem}>
            <Generic def={child} disableLoading={true} {...props}/>
        </Grid>)}
    </Grid>
}