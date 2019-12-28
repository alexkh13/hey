import React, { useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Document from './Document';
import Home from './Home';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import config from './config';

export default function App() {

  return <Router>
    <Switch>
      <Route path="/:id">
        {({match}) => <Document 
          path={config.mainPath} 
          id={match.params.id}
          render={(props) => <DocumentRenderer type={props.snapshot.data().type} {...props}/>}/>}
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>;
}

function DocumentRenderer({ type, snapshot, path}) {
  
  const LoadableComponent = useMemo(() => {
    return React.lazy(() => import('./components/' + (type.charAt(0).toUpperCase() + type.substring(1))))
  }, [type]);

  return <Suspense fallback={<Spinner/>}>
    <LoadableComponent path={path} snapshot={snapshot}/>
  </Suspense>
}

function Spinner({ error }) {

    return <Grid container alignItems="center" justify="center" className="fill">
        {(() => {
            if (error) {
                return <Grid container direction="column" alignItems="center">
                    <Typography variant="h6">Whoops!</Typography>
                    <Typography variant="body1">This shouldn't have happened</Typography>
                </Grid>
            } else {
                return <CircularProgress/>;
            }
        })()}
    </Grid>

    
}