import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function Editor() {
    const [value, setValue] = useState('');

    function onChangeHandler(newValue: string): void {
        console.log(newValue);
        setValue(newValue)
    }

    return <ReactQuill theme="snow" value={value} onChange={onChangeHandler} />;
}
