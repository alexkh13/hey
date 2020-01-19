import React from 'react';
import { Button as MaterialButton } from '@material-ui/core';

export default function Button({ text }) {
    return <MaterialButton variant="contained">
        {text}
    </MaterialButton>
}