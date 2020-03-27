import React from 'react';
import { Spinner } from 'reactstrap';

export default class Loader extends React.Component {
    render() {
        return (
            <div className="text-center" style={{marginTop:(window.innerHeight/2)-70}}>
                <Spinner color="primary"/>{<span style={{verticalAlign:'super', margin:'10px', fontSize:'1.5rem'}}>Loading {this.props.name}...</span>}
            </div>
        );
    }
}