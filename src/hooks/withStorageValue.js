import { get, set } from 'lodash';
import { useState } from 'react';

export default function useStorageValue(path, storageKey = '_default') {
    const [value, setValue] = useLocalStorage(storageKey);

    return [get(value, path), (newValue) => {
        setValue(set(value, path, newValue));
        return newValue;
    }];
}

function useLocalStorage(key) {
    const [value, setValue] = useState(read(key));
    return [value, (newValue) => {
        write(key, newValue);
        setValue(newValue);
    }];
}

function read(key) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}