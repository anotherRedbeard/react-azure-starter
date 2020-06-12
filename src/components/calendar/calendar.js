import React, {useEffect, useState} from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from '../utils/config';
import { getEvents } from '../utils/graph-service';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const Calendar = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
    console.log('calendar useEffect', props.isAuthenticated);
    //console.log('calendar useEffect more', window.msal.account);
            //check to see if user is authenticated
            if(props.isAuthenticated) {
              //Get the user's access token
              var accessToken = await window.msal.acquireTokenSilent({
                  scopes: config.scopes,
                  authority: config.authority
              });
              //Get the user's events
              var evnts = await getEvents(accessToken);
              //Update the array of events in state
              setEvents( evnts.value);
            } else {
              console.log('where here calendar ??',props.isAuthenticated);
              props.showNotify('danger', 'User not Authenticated', 'Please sign in to view this page')
            }
        }
        catch (err) {
            props.showNotify('danger', 'ERROR', JSON.stringify(err));
        }
      }
      fetchData();
  }, [props.isAuthenticated]);

  if (props.isAuthenticated) {
    return (
      <div>
        <h1>Calendar</h1>
        <Table>
          <thead>
            <tr>
              <th scope="col">Organizer</th>
              <th scope="col">Subject</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
            </tr>
          </thead>
          <tbody>
            {events.map(
              function(event){
                return(
                  <tr key={event.id}>
                    <td>{event.organizer.emailAddress.name}</td>
                    <td>{event.subject}</td>
                    <td>{formatDateTime(event.start.dateTime)}</td>
                    <td>{formatDateTime(event.end.dateTime)}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

export default Calendar;