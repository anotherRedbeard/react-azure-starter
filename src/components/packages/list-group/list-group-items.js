import React, { Fragment } from 'react';
import { ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListGroupItems = (props) => {
    const {items,dataId,displayName,selectedItem,onItemSelected} = props;

    return (
        <Fragment>
            {
                items.map((item) => (
                    <ListGroupItem active={item[dataId] === selectedItem[dataId]} key={item[dataId]} tag="button" action variant="info" 
                                    onClick={() => onItemSelected(item)}>{item[displayName]}
                                    {item[dataId] === selectedItem[dataId] && <span className='float-right'><FontAwesomeIcon icon='angle-double-right' /></span>}
                    </ListGroupItem>
                ))
            }
        </Fragment>
    )
}

export default ListGroupItems