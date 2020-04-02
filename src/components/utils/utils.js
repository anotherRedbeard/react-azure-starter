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