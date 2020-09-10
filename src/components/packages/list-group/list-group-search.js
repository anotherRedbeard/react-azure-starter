import React, { useEffect, useState, Fragment } from 'react';
import { ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Button, Spinner,
Card, CardTitle, CardText, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListGroupItems from './list-group-items';

const ListGroupSearch = (props) => {
    const {user,options,dataId,displayName,selectedItemChanged,pageSize} = props;

    const [selectedItem,setSelectedItem] = useState(options[0]);
    const [items,setItems] = useState([]);
    const [optionSearch,setOptionSearch] = useState('');

    useEffect(() => {
        var newOptions = [];
        if (optionSearch !== '') {
            newOptions = options.filter(x => x[displayName].toLowerCase().startsWith(optionSearch));
        } else {
            newOptions = options;
        }

        setItems(newOptions.slice(0,pageSize));
    }, [optionSearch])

    //effect for changes to the current page
    useEffect(() => {
        setItems(options.slice(0,pageSize))
    }, [options])

    const onItemSelected = (obj) => {
        setSelectedItem(obj);
        selectedItemChanged(obj);
    }

    const searchChanged = (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        const name = event.target.name;

        setOptionSearch(value);
    }

    return (
        <Fragment>
            <span className='text-center'>
                <h3>Items
                    {options.length > pageSize && <small><small> (Showing first {pageSize} records of {options.length})</small></small>}
                </h3>
            </span>
            {options.length > pageSize &&
                <div className='input-icon-group'>
                    <FontAwesomeIcon color='gray' className='input-icon-group input-icon' icon='search'></FontAwesomeIcon>
                    <Input className='input-icon-group input' type="input" name="optionSearch" id="optionSearch" 
                        onChange={searchChanged} value={optionSearch} 
                        placeholder={'Search for the item you are looking for'}/>
                </div>
            }
            <ListGroup>
                <ListGroupItems items={items} dataId={dataId} displayName={displayName} selectedItem={selectedItem} onItemSelected={onItemSelected}/>
            </ListGroup>
        </Fragment>
    )
}

export default ListGroupSearch