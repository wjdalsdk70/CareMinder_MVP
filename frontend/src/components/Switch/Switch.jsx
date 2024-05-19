import React, { useState } from 'react';
import './Switch.css';

export default function Switch() {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <label className={`switch ${isChecked ? 'switch-checked' : ''}`}>
            <input type="checkbox" checked={isChecked} onChange={handleChange} />
            <div></div>
        </label>
    );
};