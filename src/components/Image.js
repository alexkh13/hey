import React from 'react';

export default function Image({ src, style, ...props }) {
    return <div style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
        height: '100%',
        ...style
    }} {...props}/>
}