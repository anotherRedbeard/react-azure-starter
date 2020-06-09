import {useState, useMemo} from 'react';
import {sortArrayByDirection} from '../utils';

export const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let filteredTickets = sortArrayByDirection(items,sortConfig);
        return filteredTickets;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction ==='ascending') {
            direction = 'descending';
        }
        setSortConfig({key,direction});
    }

    return {items: sortedItems, requestSort, sortConfig}
}