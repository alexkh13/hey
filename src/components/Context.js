import React from 'react';
import Generic, { parseProps } from "./Generic";

export default function Context({ children, contextAssign, context, ...props }) {

    contextAssign = parseProps(contextAssign, context);

    context = {
        ...context,
        ...contextAssign
    }

    return <Generic {...props} context={context} def={children} />;
}