import React from 'react';
import { useCollection as useFirestoreCollection } from "react-firebase-hooks/firestore";
import { Typography, Grid } from '@material-ui/core';
import Spinner from './Spinner';
import Generic, { getCollection } from './Generic';

function useCollection(snapshot, path, query) {

  let queryParams = query || {};
    
  if (typeof path == 'object') {
    queryParams = path.query || queryParams;
    path = path.path;
  }

  let col = getCollection(snapshot, path);

  const {
    orderBy,
    limit
  } = queryParams;

  if (orderBy) {
    col = col.orderBy(orderBy.split(" ")[0], orderBy.split(" ")[1]);
  }

  if (limit) {
    col = col.limit(limit);
  }

  return useFirestoreCollection(col, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
}

export default function Collection({ match, parent, snapshot, paths, context, path, query, component, empty, children, ...props }) {

  if (path) {
    paths = {
      [path]: query
    }
  }

  const collections = {
    ...context
  };

  const is = {
    loading: false,
    error: false
  };

  for (const path in paths) {
    const name = (path||"").split('/').pop();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [s, loading, error] = useCollection(snapshot, path, query);
    is.loading = is.loading || loading;
    is.error = is.error || error;
    collections[name] = s;
  } 

  function render() {

    if (children) {
      if (typeof children === 'function') {
        if (typeof path === 'string') {
          return children(collections[path.split('/').pop()]);
        } else {
          return children(collections);
        }
      }

      return <Generic 
        match={match} 
        snapshot={snapshot} 
        def={children} 
        context={collections}
      />
    }

    if (typeof path !== 'string') {
      return "collection error"
    }

    const s = collections[path.split('/').pop()];
    
    if (s.empty) {
      if (!empty || typeof empty == 'string') {
        return <Typography color="textSecondary">{empty || "Empty"}</Typography>
      } else {
        return <Generic match={match} snapshot={snapshot} def={empty} context={context} />
      }
    }

    return <Grid container direction="column" {...props}  style={{ width: "100%", ...props.style }} >
      {s.docs.map((doc, i) => <Grid key={i} style={{ width: "100%" }} item>
        <Generic match={match} snapshot={doc} def={component} context={context}/>
      </Grid>)}
    </Grid>
  }

  return is.loading ? <Spinner/> : 
    is.error ? <Error error={is.error}/>
    : render();
}

function Error(error) {
  return <Typography style={{whiteSpace:'pre-wrap'}} variant="body2">{JSON.stringify(error, null, 2)}</Typography>;
}