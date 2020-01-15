import React from 'react';
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from '../firebase';
import { Typography, Grid } from '@material-ui/core';
import Spinner from './Spinner';
import Center from './Center';
import Generic from './Generic';

export default function Document({ match, path, id }) {

  path = `${path}/${id}`;

  const [ s, loading, error ] = useDocument(firestore.doc(path));

  return loading ? <Spinner/> : 
    error ? <Error message={`path=${path} error=${JSON.stringify(error)}`} />
    : s.exists 
      ? <Generic match={match} snapshot={s} path={path}/>
      : <Error status={404}/>
}

function Error({ status, message }) {
  return <Center>
    <Grid container direction="column" alignItems="center">
    {(() => {
      switch (status) {
        case 404: 
          return <Typography variant="h1" color="textSecondary">404</Typography>
        default:
          return <Grid container direction="column" alignItems="center">
            <Typography variant="h6">Sh*t!@#$</Typography>
            <Typography variant="body2">{message}</Typography>
          </Grid>
      }
    })()}
    </Grid>
  </Center>;
}