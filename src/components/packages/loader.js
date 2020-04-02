import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = (props) => {
    return (
        <div className="text-center" style={{marginTop:(window.innerHeight/2)-70}}>
            <Spinner color="primary"/>{<span style={{verticalAlign:'super', margin:'10px', fontSize:'1.5rem'}}>Loading {props.name}...</span>}
        </div>
    );
}

export default Loader