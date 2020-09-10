import React, { useEffect, useState, Fragment } from 'react';
import { ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button, Spinner,
Card, CardTitle, CardText, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListGroupItems from './list-group-items';

const ListGroupPaged = (props) => {
    const {user,options,dataId,displayName,selectedItemChanged,pageSize} = props;

    const [selectedItem,setSelectedItem] = useState(options[0]);
    const [currentPage,setCurrentPage] = useState(1);
    const [items,setItems] = useState([]);

    //calculated values
    let StartRecord = (currentPage-1)*pageSize;
    let EndRecord = currentPage*pageSize;

    //effect for changes to the current page
    useEffect(() => {
        setItems(options.slice(StartRecord, EndRecord));
    }, [currentPage])

    const onPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const onNextPage = () => {
        //check to see if onLastPage
        if (options.length > currentPage * pageSize) {
            setCurrentPage(currentPage + 1);
        }
    }

    const onItemSelected = (obj) => {
        setSelectedItem(obj);
        selectedItemChanged(obj);
    }

    return (
        <Fragment>
            <span className='text-center'><h3>Items <small><small>(Showing {StartRecord + 1} - {EndRecord > options.length ? options.length : EndRecord} of {options.length})</small></small></h3></span>
            <ListGroup>
                {
                    currentPage > 1 &&
                        <ListGroupItem disabled={currentPage <= 1} className='text-center' key='previous' 
                                    tag="button" action color="success" onClick={() => onPreviousPage()}>Previous</ListGroupItem>
                }
                <ListGroupItems items={items} dataId={dataId} displayName={displayName} selectedItem={selectedItem} onItemSelected={onItemSelected}/>
                {
                    currentPage*pageSize < options.length &&
                        <ListGroupItem disabled={currentPage*pageSize > options.length} className='text-center' 
                                        key='next' tag="button" action color="success" onClick={() => onNextPage()}>Next</ListGroupItem>
                }
            </ListGroup>
        </Fragment>
    )
}

export default ListGroupPaged