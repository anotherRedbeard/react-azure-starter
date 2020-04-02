import React, {useState} from 'react'
import {Button,Form,FormGroup,Label,Input,FormFeedback,Spinner} from 'reactstrap';
import NotifyUser from '../packages/notify-user';
import { createPost, updatePost } from '../utils/api-service';

const UpsertPost = (props) => {
    const [error, setError] = useState(null);
    const [post, setPost] = useState(props.post);
    const [isLoading, setIsLoading] = useState(false);
    const [validFields, setValidFields] = useState({title:true,body:true});

    const onChange = (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        const name = event.target.name;
        const optionSelectText = event.target.type === "select-one" ? event.target.options[event.target.selectedIndex].text : '';

        //special logic for system object
        if (name === "user") {
            var userObj = {id: value, name: optionSelectText};
            setPost({...post, user: userObj});
        } else {
            setPost({...post, [name]: value});
        }
        checkInputValidity(name,value);
    }

    const callUpsertPostApi = async() => {
        try {
            if (props.isAuthenticated) {
                var results;
                if (props.editPost) {
                    //process edit logic
                    results = await updatePost(post);
                    props.editPost(post);
                } else if(props.addPost) {
                    //process add logic
                    console.log('callUpsertPostAPI','add post')
                    results = await createPost(post);
                    props.addPost(post);
                }

                props.showNotify('success', post.id + ' successfully updated', JSON.stringify(results));
                return true;

            } else {
                setError({message: 'User not Authenticated. Please sign in to view this page'});
            }
        } catch (e) {
            console.log('callUpsertPostApi',e);
            setError({message: 'ERROR Occurred:  ', debug: JSON.stringify(e).length === 0 ? e : JSON.stringify(e)});
            return false;
        }
    }

    const submitForm = async(item) => {
        setIsLoading(true);
        var isUpdateSuccessful =  await callUpsertPostApi();
        setIsLoading(false);
        if (isUpdateSuccessful) {
            props.toggleModal();
        }
    }

    const checkInputValidity = (inputName, value) => {
        switch(inputName) {
            case 'title':
                value.trim().length === 0 ? setValidFields({...validFields, title:false}) : setValidFields({...validFields, title:true});
                break;
            case 'body':
                value.trim().length === 0 ? setValidFields({...validFields, body:false}) : setValidFields({...validFields, body:true});
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

    let saveButton = null;
    if (isLoading) {
        saveButton = <Button color="primary" onClick={submitForm} disabled><Spinner size='sm'/>  Saving</Button>;
    } else {
        saveButton = <Button color="primary" onClick={submitForm} disabled={checkIsFormValid()}>Save</Button>;
    }

    const userOptions = props.users.map(user => {
        return (
            <option key={user.id} value={user.id}>{user.name}</option>
        );
    });
    
    return (
        <div>
            {errorElement}
            <Form>
                <FormGroup>
                    <Label for="id">Post Id</Label>
                    <Input readOnly value={post.id} />
                </FormGroup>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" onChange={onChange} value={post.title} invalid={!validFields.title} placeholder='Enter value here' />
                    <FormFeedback>You must enter a title to save this record</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="body">Body</Label>
                    <Input type="text" name="body" id="body" onChange={onChange} value={post.body} invalid={!validFields.body} placeholder='Enter value here' />
                    <FormFeedback>You must enter a body to save this record</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="user">User</Label>
                    <Input type="select" name="user" id="user" onChange={onChange} value={post.user?.id}>
                        {userOptions}
                    </Input>
                </FormGroup>
                <br/>
                <div className="modal-footer">
                    {saveButton}
                    <Button color="secondary" onClick={props.toggleModal}>Cancel</Button>
                </div>
            </Form>
        </div>
    )
}

export default UpsertPost