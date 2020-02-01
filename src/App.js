import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Document from './components/Document';
import Home from './Home';
import config from './config';
import mainContext from './context';

export default function App() {

  const host = getHost();
  const context = {};

  return <mainContext.Provider value={context}>
    <Router>
      <Switch>
        <Route path="/:id?">
          {({match}) => {
            const documentId = host || match.params.id;
            if (host) {
              match = {
                ...match,
                url: ''
              }
            }
            if (documentId) {
              return <Document 
                match={match}
                path={config.mainPath} 
                id={documentId}
              />
            } else {
              return <Home />;
            }
          }}
        </Route>
      </Switch>
    </Router>
  </mainContext.Provider>;
}

function getHost() {
  const {customDomain} = config;
  const list = [customDomain, "localhost"];
  const url = new URL(window.location.href);
  for (const domain of list) {
    if (url.hostname.endsWith(domain)) {
      return url.hostname.replace(new RegExp(`[.]*${domain}`), "");
    }
  }
}