import React from 'react';
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from '../firebase';
import { Typography, Grid } from '@material-ui/core';
import Spinner from './Spinner';
import Generic from './Generic';

export default function Collection({ parent, snapshot, path, orderBy, limit, component, children, ...props }) {

  path = (parent || snapshot.path || snapshot.ref.path) + path;

  let query = firestore.collection(path);

  if (orderBy) {
    query = query.orderBy(orderBy.split(" ")[0], orderBy.split(" ")[1]);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const [ s, loading, error ] = useCollection(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  function render() {

    if (children) {
      return children(s);
    }
    
    return <Grid container direction="column" {...props}>
      {s.docs.map((doc, i) => <Grid key={i} item>
        <Generic snapshot={doc} def={component}/>
      </Grid>)}
    </Grid>
  }

  return loading ? <Spinner/> : 
    error ? <Error error={error}/>
    : render();
}

function Error(error) {
  return <Typography style={{whiteSpace:'pre-wrap'}} variant="body2">{JSON.stringify(error, null, 2)}</Typography>;
}