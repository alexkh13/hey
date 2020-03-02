import React from 'react';
import {Box} from "@material-ui/core"
import Generic from "./Generic"
export default function({ children, ...props }) {
    return <Box {...props}>
        {Array.isArray(children) && children.map((child, i) => <Generic key={i} def={child} {...props}/>)}
    </Box>
};