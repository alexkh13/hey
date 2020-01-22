import React from 'react';
import Generic from './Generic';

export default function Block({ condition, component, ...props }) {
    if (condition) {
        return <Generic def={component} {...props}/>;
    } else {
        return <React.Fragment/>
    }
}