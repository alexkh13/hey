import React from 'react';
import Generic from "./Generic";

export default function Context({ children, contextAssign, context, ...props }) {

    context = {
        ...context,
        ...contextAssign
    }

    return <Generic {...props} context={context} def={children} />;
}