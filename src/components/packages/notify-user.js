import React, {useState, useEffect} from 'react';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NotifyUser(props) {
    const onDismiss = () => props.setShowNotify(false);

    let icon = 'info-circle';

    switch(props.reactstrapColor) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'danger':
        case 'warning':
            icon = 'exclamation-circle';
            break;
        default:
            break;
    }

    let debug = null;
    if (props.debug) {
      debug = <div>
          <p className="mb-3"><FontAwesomeIcon icon={icon} /> {props.message}</p>
          <pre className="alert-pre border bg-light p-2"><code>{props.debug}</code></pre>
        </div>;
    } else {
        debug = <div><FontAwesomeIcon icon={icon} /> {props.message}</div>;
    }
    return (
        <Alert isOpen={props.showNotify} toggle={onDismiss} color={props.reactstrapColor}>
            {debug}
        </Alert>
    )
}