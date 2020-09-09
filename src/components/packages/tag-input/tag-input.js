import React, {useState, useEffect} from 'react';
import { Button, Input } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './tag-input.css';

const TagInput = (props) => {
    const {initialTags,tagChanged,dataId,displayName} = props;
    const [tags, setTags] = useState(initialTags?.length > 0 ? initialTags : []);

    useEffect(() => {
        tagChanged(tags);
    }, [tags])

    useEffect(() => {
        if (initialTags?.length >=0 ) {
            setTags(initialTags);
        } else {
            console.log('initialTags',initialTags);
        }
    }, [initialTags])

    const addTags = (event) => {
        if ((event.key === 'Enter' || event.key === ',' || event.key === ';') && event.target.value !== '') {
            //remove any delimiter characters
            var str = event.target.value;
            event.target.value = str.replace(/,|;/gi,'');
            setTags([...tags, {[dataId]: 0, [displayName]:event.target.value}]);
            event.target.value = '';
        }
    }

    const removeTags = (index) => {
        setTags([...tags.filter(tag => tags.indexOf(tag) !== index)]);
    }

    return (
        <div className='tag-input'>
            <ul id='tags'>
                {tags.map((tag, index) => (
                    <li key={index} className='tag-button'>
                         <Button color='primary' onClick={() => removeTags(index)}>
                             {tag[displayName]}
                            <FontAwesomeIcon icon='times' className='tag-close-icon'></FontAwesomeIcon>
                        </Button>
                    </li>
                ))}
            </ul>
            <input type='text' onKeyUp={(e) => addTags(e)} placeholder='Press enter to add tags'/>
        </div>
    )

}

export default TagInput;
