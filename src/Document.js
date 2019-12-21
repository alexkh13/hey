import React from 'react';
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from './firebase';
import { Typography, Grid } from '@material-ui/core';
import Spinner from './Spinner';
import Center from './Center';

export default function Document({ path, id, render }) {

  path = `${path}/${id}`;

  const [ snapshot, loading, error ] = useDocument(firestore.doc(path));

  return loading ? <Spinner/> : 
    error ? <Error/>
    : snapshot.exists 
      ? render({ snapshot, path })
      : <Error status={404}/>
}

function Error({ status }) {
  return <Center>
    <Grid container direction="column" alignItems="center">
    {(() => {
      switch (status) {
        case 404: 
          return <Typography variant="h1" color="textSecondary">404</Typography>
        default:
          return <Typography variant="h6">Sh*t!@#$</Typography>
      }
    })()}
    </Grid>
  </Center>;
}