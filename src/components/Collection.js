import React from 'react';
import { useCollection } from "react-firebase-hooks/firestore";
import { Typography, Grid } from '@material-ui/core';
import Spinner from './Spinner';
import Generic, { getCollection } from './Generic';

export default function Collection({ match, parent, snapshot, path, collection, orderBy, limit, component, empty, children, contextAs = 'collection', ...props }) {

  let query = getCollection(snapshot, path);

  if (orderBy) {
    query = query.orderBy(orderBy.split(" ")[0], orderBy.split(" ")[1]);
  }

  if (limit) {
    query = query.limit(limit);
  }
  
  const [s, loading, error] = useCollection(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  function render() {

    if (children) {
      if (typeof children === 'function') {
        return children(s);
      }

      return <Generic 
        match={match} 
        snapshot={snapshot} 
        def={children} 
        context={{
          [contextAs]: s
        }}
      />
    }

    if (s.empty) {
      if (!empty || typeof empty == 'string') {
        return <Typography color="textSecondary">{empty || "Empty"}</Typography>
      } else {
        return <Generic match={match} snapshot={snapshot} def={empty} />
      }
    }
    
    return <Grid container direction="column" {...props}  style={{ width: "100%", ...props.style }} >
      {s.docs.map((doc, i) => <Grid key={i} style={{ width: "100%" }} item>
        <Generic match={match} snapshot={doc} def={component}/>
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