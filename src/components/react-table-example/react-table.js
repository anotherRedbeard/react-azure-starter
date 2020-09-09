import React, {useEffect, useState} from 'react';
import { Card, Row, Col, Button, CardHeader, UncontrolledTooltip, CardBody, Input } from 'reactstrap';
import moment from 'moment';
import config from '../utils/config';
import { getEvents } from '../utils/graph-service';
import Reactable from '../packages/reactable/reactable';
import makeData from '../utils/makeData'
import ExportCSV from '../utils/export-csv';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const ReactTable = (props) => {
    const [events, setEvents] = useState([]);
    const columns = [
        {
            Header: 'Name',
            columns: [
            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
            ],
        },
        {
            Header: 'Info',
            columns: [
            {
                Header: 'Age',
                accessor: 'age',
                collapse: false,
            },
            {
                Header: 'Visits',
                accessor: 'visits',
                collapse: false,
            },
            {
                Header: 'Status',
                accessor: 'status',
                collapse: false
            },
            {
                Header: 'Profile Progress',
                accessor: 'progress',
                collapse: false,
            },
            {
                Header: 'Action',
                Cell: ({ cell })  => (
                    <Button color='primary' onClick={() => buttonClick(cell.row.values.firstName)}>{cell.row.values.firstName}</Button>
                )
            }
            ],
        },
        ];
    const data = makeData(100);

    const [selectedItem, setSelectedItem] = useState({});
    const [originalData, setOriginalData] = useState(data);
    const [filteredData, setFilteredData] = useState(data);

    const handleChange = event => {
        console.log('handleChange', event.target.value);
        if (event.target.value === '') {
            setFilteredData(originalData);
        } else {
            globalSearch(event.target.value);
        }
    };

    const globalSearch = (searchInput) => {
        let filteredData = originalData.filter(value => {
            return (
                value.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                value.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
                value.status.toLowerCase().includes(searchInput.toLowerCase()) ||
                value.age.toString().includes(searchInput.toLowerCase()) ||
                value.progress.toString().includes(searchInput.toLowerCase()) ||
                value.visits
                .toString()
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            );
        });
        setFilteredData(filteredData);
    };

    const buttonClick = (value) => {
        window.alert('you clicked something ' + value);
    }

    const onSelect = (value) => {
        setSelectedItem(value);
    }

    return (
      <div>
          <Card>
              <CardHeader>
                  <Row>
                      <Col md={7}>
                          <h4>React Table Example</h4>
                      </Col>
                      <Col md={3}>
                        <Input type="input" name="searchText" id="searchText" onChange={handleChange} placeholder='Search'></Input>
                      </Col>
                      <Col md={2}>
                          <span id='exportToExcel' className='float-right'>
                              <ExportCSV csvData={data} fileName='sample-export' />
                          </span>
                          <UncontrolledTooltip placement='top' target='exportToExcel'>
                              Click here to export to Excel
                          </UncontrolledTooltip>
                      </Col>
                  </Row>
              </CardHeader>
              <CardBody>
                <Reactable columns={columns} data={filteredData} initialPageSize={20} getRowProps={(row) => ({
                    onClick: () => onSelect(row.original),
                    style: {
                        cursor: 'pointer'
                    },
                    className: row.original.firstName === selectedItem.firstName ? 'selected' : ''
                })}/>
              </CardBody>
          </Card>
      </div>
    );
}

export default ReactTable;