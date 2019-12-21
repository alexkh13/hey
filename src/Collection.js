import React from 'react';
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from './firebase';
import { Typography } from '@material-ui/core';
import Spinner from './Spinner';

export default function Collection({ parent, path, orderBy, limit, children }) {

  path = (parent || '') + path;

  let query = firestore.collection(path);

  if (orderBy) {
    query = query.orderBy(orderBy.split(" ")[0], orderBy.split(" ")[1]);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const [ snapshot, loading, error ] = useCollection(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return loading ? <Spinner/> : 
    error ? <Error error={error}/>
    : children(snapshot)
}

function Error(error) {
  return <Typography style={{whiteSpace:'pre-wrap'}} variant="body2">{JSON.stringify(error, null, 2)}</Typography>;
}