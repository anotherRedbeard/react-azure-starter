import React, {useState} from 'react';
import { Card, Button, CardHeader, CardBody } from 'reactstrap';
import makeData from '../utils/makeData'
import TagInput from '../packages/tag-input/tag-input';

const TagInputDisplay = (props) => {
    const data = makeData(2);

    const [initialTagList,setInitialTagList] = useState(data);
    const [tagsList,setTagsList] = useState(data);

    const onTagChanged = (obj) => {
        setTagsList(obj);
        console.log('tags changed', obj);
    }

    const onSaveData = () => {
        console.log('tags to save: ', tagsList);
        window.alert('tags to save: ' + JSON.stringify(tagsList));
    }

    return (
      <div>
          <Card>
              <CardHeader>
                    <h4>Tag Control</h4>
              </CardHeader>
              <CardBody>
                  <h4>Input:</h4>
                  <TagInput initialTags={initialTagList} tagChanged={onTagChanged} dataId={'firstName'} displayName={'lastName'}/>
                  <Button onClick={onSaveData} style={{marginTop:'10px'}} className='float-right' color='primary'>Save</Button>
              </CardBody>
          </Card>
      </div>
    );
}

export default TagInputDisplay;