import React from 'react';

export default function Image({ image, style, ...props }) {
    return <div style={{
        backgroundColor: '#f3f3f3',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
        height: '100%',
        ...style
    }} {...props}/>
}