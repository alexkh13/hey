import React, { useState } from 'react';
import { Button as MaterialButton } from '@material-ui/core';
import Action from './Action';
import { Link } from 'react-router-dom';

export default function Button({ match, snapshot, text, action, href, disabled, context, ...props }) {

    const [actionOpen, setActionOpen] = useState(false);

    action = action || {};

    disabled = !!disabled;

    function handleClick() {
        setActionOpen(true);
    }
    
    function handleClose() {
        setActionOpen(false)
    }

    return <React.Fragment>
        <Action 
            open={actionOpen} 
            snapshot={snapshot} 
            context={context}
            match={match}
            input={action.input} 
            output={action.output}
            onClose={handleClose} />
        <ButtonWrapper disabled={disabled} match={match} href={href}>
            <MaterialButton 
                variant="contained"
                disabled={disabled}
                onClick={handleClick}
                {...props}>
                {text}
            </MaterialButton>
        </ButtonWrapper>
        
    </React.Fragment>
}

function ButtonWrapper({ match, href, disabled, children }) {
    if (!disabled && href) {
        return <Link style={{textDecoration:'none'}} to={`${match.url}${href}`}>{children}</Link>
    } else {
        return children;
    }
}