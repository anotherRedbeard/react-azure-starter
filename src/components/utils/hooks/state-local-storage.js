import React from 'react';

export const useStateWithLocalStorage = (localStorageKey, defaultObj) => {
    const initialState = () => {
        const obj = localStorage.getItem(localStorageKey);
        if (obj && obj !== 'undefined') {
            var foo = JSON.parse(obj);
            return foo;
        } else {
            return defaultObj;
        }
    }

    const [value, setValue] = React.useState( initialState() );

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}

