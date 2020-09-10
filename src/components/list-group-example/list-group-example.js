import React, {useState} from 'react';
import { Card, Button, CardHeader, CardBody } from 'reactstrap';
import makeData from '../utils/makeData'
import ListGroupPaged from '../packages/list-group/list-group-paged';
import ListGroupSearch from '../packages/list-group/list-group-search';

const ListGroupExample = (props) => {
    const {showNotify} = props;
    const data = makeData(20);

    const onSelectedItemChanged = (obj) => {
        console.log('tags changed', obj);
        showNotify('info', 'Selection Changed', 'You have selected item :  ' + JSON.stringify(obj));
    }


    return (
      <div>
          <Card>
              <CardHeader>
                  <h4>Paginated List Group Control</h4>
              </CardHeader>
              <CardBody>
                  <ListGroupPaged options={data} dataId={'firstName'} displayName={'lastName'} selectedItemChanged={onSelectedItemChanged} pageSize={5} />
              </CardBody>
          </Card>
          <Card>
              <CardHeader>
                  <h4>Searchable List Group Control</h4>
              </CardHeader>
              <CardBody>
                  <ListGroupSearch options={data} dataId={'firstName'} displayName={'lastName'} selectedItemChanged={onSelectedItemChanged} pageSize={5} />
              </CardBody>
          </Card>
      </div>
    );
}

export default ListGroupExample;