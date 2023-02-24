import React from 'react';
import './index.css';

export default ({
    text,
    type,
    icon,
    className
}) => {
    return <div className="button-container">
        <div className='button'>
            {text}
        </div>
    </div>;
};