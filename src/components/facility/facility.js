import React, {useState, useEffect} from 'react'
import {Table,
    ButtonGroup,
    Container } from 'reactstrap';
import moment from 'moment';
import { getFacilities, getPipelineSystems } from '../utils/api-service';
import Loader from '../packages/loader';
import ModalForm from '../packages/modal-form';
import UpsertFacility from './facility-upsert';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const Facility = (props) => {
    const [facilities, setFacilities] = useState([]);
    const [systems, setSystems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (props.isAuthenticated) {
                  //Get the user's events
                  var [facilities, systems] = await Promise.all([ getFacilities(), getPipelineSystems() ]);
                  //Update the array of events in state
                  setFacilities(facilities);
                  setSystems(systems);
                  setIsLoading(false);
                } else {
                    props.showNotify('danger', 'User not Authenticated', 'Please sign in to view this page')
                }
            }
            catch (err) {
                props.showNotify('danger', 'ERROR', JSON.stringify(err));
            }
        }
        fetchData();
    }, []);

    const editFacility = (facility) => {
        setIsLoading(true);
        setFacilities(facilities.map(item => (item.facilityId === facility.facilityId ? facility : item)));
        setIsLoading(false);
    }
  
    const addFacility = (facility) => {
        setIsLoading(true);
        setFacilities(prevArray => [...prevArray, facility]);
        setIsLoading(false);
    }

    if (props.isAuthenticated) {

        if (isLoading) {
            return (
                <Loader name='Facilities'/>
            );
        }

        const facilitiesRender = facilities.map(facility => {
            return (
            <tr key={facility.facilityId}>
                <td>{facility.facilityId}</td>
                <td>{facility.facilityName}</td>
                <td>{facility.operator}</td>
                <td>{facility.system?.systemName}</td>
                <td>{formatDateTime(facility.modifiedTimestamp)}</td>
                <td>{facility.isFacilityActive ? 'Yes' : 'No'}</td>
                <td>
                <ButtonGroup>
                    <ModalForm buttonLabel="Edit" 
                    user={props.user}
                    render={edit => ( <UpsertFacility systems={systems} facility={facility} toggleModal={edit.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify}  editFacility={editFacility} />)} />
                </ButtonGroup>
                </td>
            </tr>
            )
        });

        const nextFacilityId = 1+Math.max.apply(Math, facilities.map(function(o) { return o.facilityId; }));
        var newFacility = {
            facilityId: nextFacilityId,
            facilityName: '',
            operator: '',
            system: systems[0],
            isFacilityActive: true
        };

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                    <ModalForm buttonLabel="Add Facility" 
                        user={props.user}
                        render={add => ( <UpsertFacility systems={systems} facility={newFacility} toggleModal={add.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify} addFacility={addFacility} />)}/>
                    </div>
                    <h3>Facilities</h3>
                    <Table>
                    <thead>
                        <tr>
                        <th scope="col">Facility Id</th>
                        <th scope="col">Facility Name</th>
                        <th scope="col">Operator</th>
                        <th scope="col">System</th>
                        <th scope="col">Last Modified Date</th>
                        <th scope="col">Is Active?</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facilitiesRender}
                    </tbody>
                    </Table>
                </Container>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

export default Facility;