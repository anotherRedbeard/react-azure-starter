import React, {Fragment, useState} from 'react'
import {Table, NavLink, Card, CardHeader, Row, Col, CardBody,
        ButtonGroup, Pagination, PaginationItem, PaginationLink,
        Container, Input, Form, FormGroup, Label } from 'reactstrap';
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table'

import makeData from './makeData'

function TableExample({ columns, data, handleChange }) {

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
        columns,
        data,
        initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    )

    

    // Render the UI for your table
    return (
        <Fragment>
            <Row>
                <h1>Example of react-table</h1>
            </Row>
            <Row>
                <Col xs={9}>
                    <Form inline>
                        <FormGroup>
                            <Input style={{marginRight: '5px'}} type="select" name="pageSize" id="pageSize" onChange={e => { setPageSize(Number(e.target.value)) }} value={pageSize}>
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>Show {pageSize} </option>
                                ))}
                            </Input>
                            <Label for='pageSize'> records per page</Label>
                        </FormGroup>
                    </Form>
                </Col>
                <Col xs={3}>
                    <Input type="input" name="searchText" id="searchText" onChange={handleChange} placeholder='Search'></Input>
                </Col>
            </Row>
            <Row>
                <Table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th className={column.collapse ? 'collapse' : ''}
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                            <span className={column.isSorted ? (column.isSortedDesc ? 'descending' : 'ascending') : ''}> {column.render('Header')} </span>
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                            <td
                                {...cell.getCellProps({
                                className: cell.column.collapse ? 'collapse' : '',
                                })}
                            >
                                {cell.render('Cell')}
                            </td>
                            )
                        })}
                        </tr>
                    )
                    })}
                </tbody>
                </Table>
            </Row>
            {/* Pagination can be built however you'd like. This is just a very basic UI implementation: */}
            <Row>
                <Col xs={6}>
                    <Form inline>
                        <FormGroup>
                            <Label for='pageSize'>Showing page {pageIndex + 1}  of {pageOptions.length}, at a rate of </Label>
                            <Input style={{marginRight: '5px', marginLeft: '5px'}} type="select" name="pageSize" id="pageSize" onChange={e => { setPageSize(Number(e.target.value)) }} value={pageSize}>
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}> {pageSize} </option>
                                ))}
                            </Input>
                            <Label>records per page</Label>
                        </FormGroup>
                    </Form>
                </Col>
                <Col xs={6}>
                    <Pagination className='float-right'>
                        <PaginationItem disabled={!canPreviousPage}>
                            <PaginationLink first onClick={() => gotoPage(0)} />
                        </PaginationItem>
                        <PaginationItem disabled={!canPreviousPage}>
                            <PaginationLink previous onClick={() => previousPage()} />
                        </PaginationItem>
                        <PaginationItem disabled={!canNextPage}>
                            <PaginationLink next onClick={() => nextPage()} />
                        </PaginationItem>
                        <PaginationItem disabled={!canNextPage}>
                            <PaginationLink last onClick={() => gotoPage(pageCount -1 )} />
                        </PaginationItem>
                    </Pagination>
                </Col>
            </Row>
        </Fragment>
    )
}

function ReactTableExample() {
  const columns = React.useMemo(
    () => [
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
        ],
      },
    ],
    []
  )
  const data = React.useMemo(() => makeData(100), []);
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


  return <TableExample columns={columns} data={filteredData} handleChange={handleChange} />
}

export default ReactTableExample