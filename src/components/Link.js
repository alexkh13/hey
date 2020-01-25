import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Generic from './Generic';

export default function Link({ match, href, snapshot, component, ...props }) {
    return <RouterLink to={`${match.url}${href}`} {...props}>
        <Generic snapshot={snapshot} def={component}/>
    </RouterLink>
}