import React from 'react';
import Generic from './Generic';

export default function Block({ condition, component, ...props }) {
    if (evalCondition(condition)) {
        return <Generic def={component} {...props}/>;
    } else {
        return <React.Fragment/>
    }
}

function evalCondition(c) {
    if (typeof c == 'object') {
        switch (c.type) {
            case "eq": 
                return c.left === c.right;
            default: 
                return false;
        }
    } else {
        return !!c;
    }
}