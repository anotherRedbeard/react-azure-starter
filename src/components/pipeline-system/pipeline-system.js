import React, {useState, useEffect} from 'react';
import {Table,
        ButtonGroup,
        Container } from 'reactstrap';
import moment from 'moment';
import { getPipelineSystems } from '../utils/lagoon-api-service';
import Loader from '../packages/loader';
import ModalForm from '../packages/modal-form';
import UpsertPipelineSystem from './pipeline-system-upsert';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const PipelineSystem = (props) => {
    const [systems,setSystems] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (props.isAuthenticated) {
                  //Get the user's events
                  var [systems] = await Promise.all([ getPipelineSystems() ]);
                  //Update the array of events in state
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

    const editSystem = (system) => {
      setIsLoading(true);
      setSystems(systems.map(item => (item.systemId === system.systemId ? system : item)));
      setIsLoading(false);
    }

    const addSystem = (system) => {
      setIsLoading(true);
      setSystems(prevArray => [...prevArray, system]);
      setIsLoading(false);
    }

    if (props.isAuthenticated) {

      if (isLoading) {
        return (
          <Loader name='Pipeline Systems'/>
        );
      }

      const pipelineSystems = systems.map(system => {
        return (
          <tr key={system.systemId}>
            <td>{system.systemId}</td>
            <td>{system.systemName}</td>
            <td>{formatDateTime(system.modifiedTimestamp)}</td>
            <td>{system.isSystemActive ? 'Yes' : 'No'}</td>
            <td>
              <ButtonGroup>
                <ModalForm buttonLabel="Edit" 
                  user={props.user}
                  render={edit => ( <UpsertPipelineSystem system={system} toggleModal={edit.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify}  editSystem={editSystem} />)} />
              </ButtonGroup>
            </td>
          </tr>
        )
      });

      const nextSystemId = 1+Math.max.apply(Math, systems.map(function(o) { return o.systemId; }));
      var newSystem = {
        systemId: nextSystemId,
        systemName: '',
        isSystemActive: true
      };

      return (
        <div>
          <Container fluid>
            <div className="float-right">
              <ModalForm buttonLabel="Add System" 
                user={props.user}
                render={add => ( <UpsertPipelineSystem system={newSystem} toggleModal={add.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify} addSystem={addSystem} />)}/>
            </div>
            <h3>Pipeline Systems</h3>
            <Table>
              <thead>
                <tr>
                  <th scope="col">System Id</th>
                  <th scope="col">System Name</th>
                  <th scope="col">Last Modified Date</th>
                  <th scope="col">Is Active?</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pipelineSystems}
              </tbody>
            </Table>
          </Container>
        </div>
      );
    } else {
      return (<div></div>);
    }
}

export default PipelineSystem;