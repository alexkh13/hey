import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Generic, {parseProps} from './Generic';

export default function Routes({ match, path, snapshot, children }) {
    const context = {
        path
    }
    if (children) {
        return <Switch>
            {children.map(({ component, path, ...props }, index) => <Route 
                key={index} 
                path={`${match.url}${path}`} 
                {...props}>
                {({match}) => <Generic 
                    match={match} 
                    path={context.path}
                    snapshot={snapshot} 
                    def={parseProps(component, { ...context, match})}/>}
            </Route>)}
        </Switch>
    } else {
        return `undefined routes`;
    }
}