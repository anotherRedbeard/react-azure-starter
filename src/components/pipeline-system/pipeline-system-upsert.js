import React, {useState} from 'react'
import {Button,Form,FormGroup,Label,Input,FormFeedback} from 'reactstrap';
import NotifyUser from '../packages/notify-user';
import { upsertPipelineSystem } from '../utils/api-service';

const UpsertPipelineSystem = (props) => {
    const [error, setError] = useState(null);
    const [system, setSystem] = useState(props.system);
    const [validFields, setValidFields] = useState({systemName:true});

    const onChange = (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        const name = event.target.name;

        setSystem({...system, [name]: value});
        checkInputValidity(name,value);
    }

    const callUpsertSystemsApi = async() => {
        try {
            if (props.isAuthenticated) {
                var systems = [system];
                var results = await upsertPipelineSystem(systems);

                //check results and close modal
                if (results.HasErrors) {
                    setError({message: JSON.stringify(results.Message)});
                    return false;
                } else {
                    //if edit
                    if (props.editSystem) {
                        props.editSystem(system);
                    }
                    //if new
                    if (props.addSystem) {
                        props.addSystem(system);
                    }
                    props.showNotify('success', system.systemName + ' successfully updated', JSON.stringify(results.Messages));
                    return true;
                }
            } else {
                setError({message: 'User not Authenticated. Please sign in to view this page'});
            }
        } catch (e) {
            console.log('callUpsertSystemsApi',e);
            setError({message: 'ERROR Occurred:  ', debug: JSON.stringify(e).length === 0 ? e : JSON.stringify(e)});
            return false;
        }
    }

    const submitForm = async(item) => {
        var isUpdateSuccessful =  await callUpsertSystemsApi();
        if (isUpdateSuccessful) {
            //props.toggleModal();
        }
    }

    const checkInputValidity = (inputName, value) => {
        switch(inputName) {
            case 'systemName':
                value.trim().length === 0 ? setValidFields({...validFields, systemName:false}) : setValidFields({...validFields, systemName:true});
                break;
            default:
                break
        }
    }

    const checkIsFormValid = () => {
        var validFieldsPropertyArray = Object.keys(validFields);
        return !validFieldsPropertyArray.every((item) => {return validFields[item] === true});
    }

    let errorElement = null;
    if (error) {
        errorElement = <NotifyUser message={error.message} reactstrapColor='danger' debug={error.debug} />;
    }
    
    return (
        <div>
            {errorElement}
            <Form>
                <FormGroup>
                    <Label for="systemId">System Id</Label>
                    <Input readOnly value={system.systemId} />
                </FormGroup>
                <FormGroup>
                    <Label for="systemName">System Name</Label>
                    <Input type="text" maxLength="150" name="systemName" id="systemName" onChange={onChange} value={system.systemName} invalid={!validFields.systemName} placeholder='Enter value here' />
                    <FormFeedback>You must enter a system name to save this record</FormFeedback>
                </FormGroup>
                <FormGroup check>
                    <Label check for="isSystemActive">
                        <Input type="checkbox" name="isSystemActive" id="isSystemActive" onChange={onChange} defaultChecked={!!system.isSystemActive}/>{' Is Active?'} 
                    </Label>
                </FormGroup>
                <br/>
                <div className="modal-footer">
                    <Button color="primary" onClick={submitForm} disabled={checkIsFormValid()}>Save</Button>
                    <Button color="secondary" onClick={props.toggleModal}>Cancel</Button>
                </div>
            </Form>
        </div>
    )
}

export default UpsertPipelineSystem;