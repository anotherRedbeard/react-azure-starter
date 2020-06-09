export function sortArrayByProperty(array, propName) {
    return array.sort((obj1, obj2) => {
        if (obj1[propName] < obj2[propName]) {
            return -1;
        }
        if (obj1[propName] > obj2[propName]) {
            return 1;
        }
        return 0;
    });
}

export function sortArrayByDirection(array, sortConfig) {
    return array.sort((obj1, obj2) => {
        if (obj1[sortConfig.key] < obj2[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (obj1[sortConfig.key] > obj2[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });
}