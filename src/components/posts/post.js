import React, {useState, useEffect} from 'react';
import {Table,
        ButtonGroup,
        Container } from 'reactstrap';
import moment from 'moment';
import { getPosts } from '../utils/api-service';
import Loader from '../packages/loader';
import ModalForm from '../packages/modal-form';
import UpsertPipelineSystem from '../pipeline-system/pipeline-system-upsert';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const Posts = (props) => {
    const [allPosts,setAllPosts] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (props.isAuthenticated) {
                  //Get the user's events
                  var [posts] = await Promise.all([ getPosts() ]);
                  console.log('fetchData',posts);
                  //Update the array of events in state
                  setAllPosts(posts);
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

    const editPost = (post) => {
      setIsLoading(true);
      setAllPosts(allPosts.map(item => (item.id === post.id ? post : item)));
      setIsLoading(false);
    }

    const addPost = (post) => {
      setIsLoading(true);
      setAllPosts(prevArray => [...prevArray, post]);
      setIsLoading(false);
    }

    if (props.isAuthenticated) {

      if (isLoading) {
        return (
          <Loader name='Posts'/>
        );
      }

      const postsToDisplay = allPosts.map(item => {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.title}</td>
            <td>{item.body}</td>
            <td>
              <ButtonGroup>
                <ModalForm buttonLabel="Edit" 
                  user={props.user}
                  render={edit => ( <UpsertPipelineSystem system={null} toggleModal={edit.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify}  editPost={editPost} />)} />
              </ButtonGroup>
            </td>
          </tr>
        )
      });

      const nextId = 1+Math.max.apply(Math, allPosts.map(function(o) { return o.id; }));
      var newPost = {
        id: nextId,
        title: '',
        body: ''
      };

      return (
        <div>
          <Container fluid>
            <div className="float-right">
              <ModalForm buttonLabel="Add System" 
                user={props.user}
                render={add => ( <UpsertPipelineSystem post={newPost} toggleModal={add.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify} addPost={addPost} />)}/>
            </div>
            <h3>Posts</h3>
            <Table>
              <thead>
                <tr>
                  <th scope="col">Post Id</th>
                  <th scope="col">Title</th>
                  <th scope="col">Body</th>
                  <th scope="col">User</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {postsToDisplay}
              </tbody>
            </Table>
          </Container>
        </div>
      );
    } else {
      return (<div></div>);
    }
}

export default Posts;