import React, { useState } from 'react';
import { Button as MaterialButton } from '@material-ui/core';
import Action from './Action';
import { Link } from 'react-router-dom';

export default function Button({ match, snapshot, text, action, href, ...props }) {

    const [actionOpen, setActionOpen] = useState(false);

    action = action || {};

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
        <ButtonWrapper match={match} href={href}>
            <MaterialButton 
                variant="contained"
                onClick={handleClick}
                {...props}>
                {text}
            </MaterialButton>
        </ButtonWrapper>
        
    </React.Fragment>
}

function ButtonWrapper({ match, href, children }) {
    if (href) {
        return <Link to={`${match.url}${href}`}>{children}</Link>
    } else {
        return children;
    }
}