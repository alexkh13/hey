import React from 'react';

export default function Header({ background, ...props }) {
    return <div {...props} style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
        height: '50vh',
        ...props.style
    }}/>
}