import React, {Fragment, useState, useMemo} from 'react'
import {Table, ButtonGroup, InputGroup, InputGroupAddon, Row, Col, InputGroupText,
        Button, Input } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './reactable.css'

function TableUI({ columns, data, enablePaging, initialPageSize, getRowProps }) {

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        // we are using rows and page since enablePaging is configurable
        rows, // all rows
        page, // only the rows for the active page

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
    } = useTable.apply(this, enablePaging ? 
        [
            {
                columns,
                data,
                initialState: { pageIndex: 0, pageSize: initialPageSize }
            },
            useSortBy,
            usePagination
        ] 
        :
        [
            {
                columns,
                data
            },
            useSortBy
        ]
    )

    //setup dataRows based on paging needs
    const dataRows = enablePaging ? page : rows;
    const startingPageCount = ((pageIndex * pageSize) +1);
    const endingPageCount = ((pageIndex * pageSize) + pageSize) > rows.length ? rows.length : ((pageIndex * pageSize) + pageSize);

    // Render the UI for your table
    return (
        <Fragment>
            {enablePaging &&
                <Row style={{marginBottom: '10px'}}>
                    <Col xs={7}> 
                        <InputGroup>
                            <Input className={''} type="select" name="pageSize" id="pageSize" onChange={e => { setPageSize(Number(e.target.value)) }} value={pageSize}>
                                {[20, 40, 60, 80, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>Show {pageSize} </option>
                                ))}
                            </Input>
                            <InputGroupAddon addonType='append'>
                                <InputGroupText>records per page.</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType='append'>
                                <InputGroupText>{startingPageCount} - {endingPageCount} of {rows.length} total rows</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            }
            <Row>
                <Table className='reactable' {...getTableProps()} striped bordered hover size="sm">
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
                    {dataRows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps(getRowProps(row))}>
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
            {enablePaging &&
                <Row>
                    <Col xs={12} className='text-center'>
                        <ButtonGroup>
                            <Button color="primary" disabled={!canPreviousPage} onClick={() => gotoPage(0)}>
                                <FontAwesomeIcon icon='angle-double-left' size='lg'></FontAwesomeIcon>
                            </Button>
                            <Button color="primary" disabled={!canPreviousPage} onClick={() => previousPage()}>
                                <FontAwesomeIcon icon='angle-left' size='lg'></FontAwesomeIcon>
                            </Button>
                            <span className='input-group-text-white-bg'>Showing page {pageIndex + 1}  of {pageOptions?.length}</span>
                            <Button color="primary" disabled={!canNextPage} onClick={() => nextPage()}>
                                <FontAwesomeIcon icon='angle-right' size='lg'></FontAwesomeIcon>
                            </Button>
                            <Button color="primary" disabled={!canNextPage} onClick={() => gotoPage(pageCount-1)}>
                                <FontAwesomeIcon icon='angle-double-right' size='lg'></FontAwesomeIcon>
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            }
        </Fragment>
    )
}

function Reactable({enablePaging = true, initialPageSize = 20, getRowProps = () => ({}), ...props}) {
    const memoColumns = useMemo(
        () => props.columns,
        [props.columns]
    );

    const memoData = useMemo(
        () => props.data,
        [props.data]
    );

    return <TableUI columns={memoColumns} data={memoData} enablePaging={enablePaging} initialPageSize={initialPageSize} getRowProps={getRowProps} />
}

export default Reactable;