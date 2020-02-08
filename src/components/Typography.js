import React from 'react';
import { Typography as MaterialTypography } from '@material-ui/core';

export default function Typography({ text, ...props }) {

    // if (typeof text !== 'string') {
    //     return `Error: expected text, found ${typeof text}`;
    // }

    return <MaterialTypography {...props}>{String(text)}</MaterialTypography>
}