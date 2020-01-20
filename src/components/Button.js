import React, { useState } from 'react';
import { Button as MaterialButton } from '@material-ui/core';
import Action from './Action';

export default function Button({ snapshot, text, action }) {

    const [actionOpen, setActionOpen] = useState(false);

    function handleClick() {
        setActionOpen(true);
    }

    return <React.Fragment>
        <Action 
            open={actionOpen} 
            snapshot={snapshot} 
            input={action.input} 
            output={action.output}
            onClose={() => setActionOpen(false)} />
        <MaterialButton 
            variant="contained"
            onClick={handleClick}>
            {text}
        </MaterialButton>
    </React.Fragment>
}