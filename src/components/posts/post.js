import React, {useState, useEffect} from 'react';
import {Table, NavLink, Card, CardHeader, Row, Col, CardBody,
        ButtonGroup,
        Container } from 'reactstrap';
import moment from 'moment';
import { getPosts, getUsers } from '../utils/api-service';
import Loader from '../packages/loader';
import ModalForm from '../packages/modal-form';
import UpsertPost from './post-upsert';
import ModalFromButton from '../packages/modal-from-button';
import { useSortableData } from '../utils/hooks/sortable-data';
import './post.css';

//Helper function to format Graph date/time
function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

const Posts = (props) => {
    const [allPosts,setAllPosts] = useState([]);
    const [allUsers,setAllUsers] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const {items, requestSort, sortConfig} = useSortableData(allPosts, {key: 'id', direction: 'ascending'});
    const getSortClassNamesFor = (name) => {
      if (!sortConfig) {
          return;
      }

      return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    useEffect(() => {
      console.log('useEffect post');
        const fetchData = async () => {
            try {
                if (props.isAuthenticated) {
                  //Get the user's events
                  var [posts, users] = await Promise.all([ getPosts(), getUsers() ]);
                  //Update the array of events in state
                  setAllPosts(posts);
                  setAllUsers(users);
                  setIsLoading(false);
                } else {
              console.log('where here post??',props.isAuthenticated);
                    props.showNotify('danger', 'User not Authenticated', 'Please sign in to view this page')
                }
            }
            catch (err) {
                props.showNotify('danger', 'ERROR', JSON.stringify(err));
            }
        }
        fetchData();
    }, [props.isAuthenticated]);

    const editPost = (post) => {
      setAllPosts(allPosts.map(item => (item.id === post.id ? post : item)));
    }

    const addPost = (post) => {
      setAllPosts(prevArray => [...prevArray, {...post, userId:post.user.id}]);
    }

    if (props.isAuthenticated) {

      if (isLoading) {
        return (
          <Loader name='Posts'/>
        );
      }

      const postsToDisplay = items.map(item => {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.body}</td>
            <td>{allUsers.find(x => x.id === parseInt(item.userId))?.name}</td>
            <td className='text-center'>
              <ButtonGroup>
                <ModalForm buttonLabel="Edit" 
                  user={props.user}
                  render={edit => ( <UpsertPost post={item} users={allUsers} toggleModal={edit.toggleModal} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify}  editPost={editPost} />)} />
              </ButtonGroup>
            </td>
          </tr>
        )
      });

      const nextId = 1+Math.max.apply(Math, allPosts.map(function(o) { return o.id; }));
      var newPost = {
        id: nextId,
        title: '',
        body: '',
        user: allUsers[0]
      };

      return (
        <div>
          <Card>
              <CardHeader>
                  <Row>
                      <Col md={10}>
                          <h4>Posts</h4>
                      </Col>
                      <Col md={2}>
                      <ModalFromButton buttonLabel="Add System" 
                          user={props.user}
                          render={(modal,toggle) => ( <UpsertPost post={newPost} users={allUsers} toggleModal={toggle} isAuthenticated={props.isAuthenticated} showNotify={props.showNotify} addPost={addPost} />)}/>
                      </Col>
                  </Row>
              </CardHeader>
              <CardBody>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th scope="col"><NavLink href='#' className={getSortClassNamesFor('id')} onClick={() => requestSort('id')}>Post Id</NavLink></th>
                      <th scope="col"><NavLink href='#' className={getSortClassNamesFor('title')} onClick={() => requestSort('title')}>Title</NavLink></th>
                      <th scope="col"><NavLink href='#' className={getSortClassNamesFor('body')} onClick={() => requestSort('body')}>Body</NavLink></th>
                      <th scope="col"><NavLink href='#' className={getSortClassNamesFor('userId')} onClick={() => requestSort('userId')}>User</NavLink></th>
                      <th scope="col"><NavLink href='#' disabled>Actions</NavLink></th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsToDisplay}
                  </tbody>
                </Table>
              </CardBody>
          </Card>
        </div>
      );
    } else {
      return (<div></div>);
    }
}

export default Posts;