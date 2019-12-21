import React from 'react';
import { Grid, CircularProgress } from "@material-ui/core";

export default function Spinner() {
    return <Grid container className="fill" alignItems="center" justify="center">
        <CircularProgress/>
    </Grid>
}