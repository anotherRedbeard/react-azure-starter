import React, {useState} from 'react';
import {Button,Form,FormGroup,Label,Input,FormFeedback} from 'reactstrap';
import NotifyUser from '../packages/notify-user';
import { upsertFacilities } from '../utils/api-service';

const UpsertFacility = (props) => {
    const [error,setError] = useState(null);
    const [facility, setFacility] = useState(props.facility);
    const [validFields, setValidFields] = useState({facilityName:true,operator:true});

    const onChange = (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        const name = event.target.name;
        const optionSelectText = event.target.type === "select-one" ? event.target.options[event.target.selectedIndex].text : '';

        //special logic for system object
        if (name === "system") {
            var systemObj = {systemId: value, systemName: optionSelectText};
            setFacility({...facility, system: systemObj});
        } else {
            setFacility({...facility, [name]: value});
        }
        checkInputValidity(name,value);
    }

    const callUpsertFacilitiesApi = async() => {
        try {
            if (props.isAuthenticated) {
                var facilities = [facility];
                var results = await upsertFacilities(facilities);

                //check results and close modal
                if (results.HasErrors) {
                    setError({message: JSON.stringify(results.Message)});
                    return false;
                } else {
                    //if edit
                    if (props.editFacility) {
                        props.editFacility(facility);
                    }
                    //if new
                    if (props.addFacility) {
                        props.addFacility(facility);
                    }
                    props.showNotify('success', facility.facilityName + ' successfully updated', JSON.stringify(results.Messages));
                    return true;
                }
            } else {
                setError({message: 'User not Authenticated. Please sign in to view this page'});
            }
        } catch (e) {
            console.log('callUpsertFacilities',e);
            setError({message: 'ERROR Occurred:  ', debug: JSON.stringify(e).length === 0 ? e : JSON.stringify(e)});
            return false;
        }
    }

    const submitForm = async(item) => {
        var isUpdateSuccessful =  await callUpsertFacilitiesApi();
        if (isUpdateSuccessful) {
            props.toggleModal();
        }
    }

    const checkInputValidity = (inputName, value) => {
        switch(inputName) {
            case 'facilityName':
                value.trim().length === 0 ? setValidFields({...validFields, facilityName:false}) : setValidFields({...validFields, facilityName:true});
                break;
            case 'operator':
                value.trim().length === 0 ? setValidFields({...validFields, operator:false}) : setValidFields({...validFields, operator:true});
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

    const systemOptions = props.systems.map(system => {
        return (
            <option key={system.systemId} value={system.systemId}>{system.systemName}</option>
        );
    });

    return (
        <div>
            {errorElement}
            <Form>
                <FormGroup>
                    <Label for="facilityId">Facility Id</Label>
                    <Input readOnly value={facility.facilityId}/>
                </FormGroup>
                <FormGroup>
                    <Label for="facilityName">Facility Name</Label>
                    <Input type="text" maxLength="150" name="facilityName" id="facilityName" onChange={onChange} value={facility.facilityName} invalid={!validFields.facilityName} placeholder='Enter value here' />
                    <FormFeedback>You must enter a facility name to save this record</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="operator">Operator</Label>
                    <Input type="text" maxLength="150" name="operator" id="operator" onChange={onChange} value={facility.operator} invalid={!validFields.operator} placeholder='Enter value here' />
                    <FormFeedback>You must enter a operator to save this record</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="system">System</Label>
                    <Input type="select" name="system" id="system" onChange={onChange} value={facility.system?.systemId}>
                        {systemOptions}
                    </Input>
                </FormGroup>
                <FormGroup check>
                    <Label check for="isFacilityActive">
                        <Input type="checkbox" name="isFacilityActive" id="isFacilityActive" onChange={onChange} defaultChecked={!!facility.isFacilityActive}/>{' Is Active?'} 
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
};

export default UpsertFacility;