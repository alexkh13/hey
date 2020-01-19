import React from 'react';
import { Typography as MaterialTypography } from '@material-ui/core';

export default function Typography({ text, ...props }) {
    return <MaterialTypography {...props}>{text}</MaterialTypography>
}