import React from 'react';
import { Grid } from '@material-ui/core';
import Generic from './Generic';

export default function Layout({ children, style, direction, spacing, alignItems, justify , ...props }) {
    const itemStyle = {
        ...direction === 'column' && {
            width: "100%"
        }
    };
    const containerProps = {
        direction, spacing, alignItems, justify
    };

    return <Grid container wrap="nowrap" {...containerProps} style={style}>
        {children.map(({ layoutItem, ...child }, index) => <Grid key={index} style={itemStyle} item {...layoutItem}>
            <Generic def={child} disableLoading={true} {...props}/>
        </Grid>)}
    </Grid>
}