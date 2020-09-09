import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Container, Alert } from 'reactstrap';
import NavBar from '../packages/navbar';
import NotifyUser from '../packages/notify-user';
import Welcome from '../welcome/welcome';
import 'bootstrap/dist/css/bootstrap.css';
import config from '../utils/config';
import {parseError} from '../utils/utils';
import { UserAgentApplication } from 'msal';
import { getUserDetails, getUserPhoto, getUserGroups } from '../utils/graph-service';
import Calendar from '../calendar/calendar';
import Posts from '../posts/post';
import ReactTable from '../react-table-example/react-table';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faQuestionCircle, faExclamationCircle, faInfoCircle, faAngleDoubleRight, faAngleDoubleLeft, faAngleRight, faAngleLeft, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import msalApp from '../utils/auth-utils';
import TagInputDisplay from '../tag-input-example/tag-input-display';

library.add(faCheckCircle, faQuestionCircle, faExclamationCircle, faInfoCircle, faAngleDoubleRight, faAngleDoubleLeft, faAngleRight, faAngleLeft, faDownload, faTimes);

const App = (props) => {
    let userAcct = msalApp.getAccount();

    const [userAgentApplication,setUserAgentApplication] = useState(msalApp);
    const [isAuthenticated,setIsAuthenticated] = useState(userAcct !== null);
    const [user,setUser] = useState(userAcct);
    const [error,setError] = useState({});
    const [showNotify,setShowNotify] = useState(false);
    const [notify,setNotify] = useState({});
    
    useEffect(() => {
      try {
        var userAgent = new UserAgentApplication({
          auth: {
            clientId: config.appId,
            redirectUri: config.redirectUri,
            authority: config.authority
          },
          cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
          }
        });
        setUserAgentApplication(userAgent);

        var user = userAgent.getAccount();
        setUser(user);
        setIsAuthenticated(user !== null);

      }
      catch (err) {
        var parsedError = parseError(err);
        console.log(parsedError);
        setError({
          message: parsedError,
          debug: JSON.stringify(err)
        });
      }
    }, []);

    useEffect(() => {
      try {
        console.log('userAgent',userAgentApplication);
        if (!(Object.keys(userAgentApplication).length === 0 && userAgentApplication.constructor === Object)) {
          //Enhance user object with data from Graph
          getUserProfile();
        }
      } catch (err) {
        var parsedError = parseError(err);
        console.log(parsedError);
        setError({
          message: parsedError,
          debug: JSON.stringify(err)
        });
      }
    }, [userAgentApplication]);

  const login = async() => {
    try {
      await userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account",
          authority: config.authority
        });

        window.location.reload(false);
    }
    catch (err) {
      var parsedError = parseError(err);
      console.log(parsedError);
      setError({
        message: parsedError,
        debug: JSON.stringify(err)
      });
    }

    setIsAuthenticated(false);
    setUser({});
  }

  const logout = () => {
    userAgentApplication.logout();
  }

  const isUserInAdminRole = (userRoles) => {
    //this is the check for user groups, but it is commented out so we can make the buttons work for this sample, in the event that you use this code,
    //you will need to create a group for admin access and grant admin consent to the group.read.all scope for the app in azure AD
    //return userRoles.some(userRole => userRole.id === config.isAdminGroupId);
    return true;
  }

  const getUserProfile = async() => {
    try {
      console.log('getUserProfile');
      //Get the access token silently. If the cache contains a non-expired token, this function will just return the cached token. Otherwise, it will make a request to the Azure OAuth endpoint to get a token
      var accessToken = await userAgentApplication.acquireTokenSilent({
        scopes: config.scopes,
        authority: config.authority
      });

      if (accessToken) {
        var [user, photo, userGroups] = await Promise.all([ getUserDetails(accessToken), getUserPhoto(accessToken), getUserGroups(accessToken)]);

        var isUserAdmin = isUserInAdminRole(userGroups.value);
        setIsAuthenticated(true);
        setUser({
            displayName: user.displayName,
            email: user.email || user.userPrincipalName,
            avatar: photo,
            isAdmin: isUserAdmin
          });
        setError(null);
      }
    }
    catch(err) {
      var parsedError = parseError(err);
      console.log(parsedError);
      setError({
        message: parsedError,
        debug: JSON.stringify(err)
      });

      setIsAuthenticated(false);
      setUser({});
    }
  }

  const setNotifyMessage = (color, message, debug) => {
    setShowNotify(true);
    setNotify({
      message:message, 
      color:color, 
      debug:debug
    });
  }

  return (
    <Router>
      <div>
        <NavBar
          isAuthenticated={isAuthenticated}
          authButtonMethod={isAuthenticated ? logout.bind(this) : login.bind(this)}
          user={user}/>
        <Container>
          <NotifyUser showNotify={showNotify} setShowNotify={setShowNotify} message={notify.message} reactstrapColor={notify.color} debug={notify.debug} />
          <Route exact path="/" render={(props) => 
            <Welcome {...props} isAuthenticated={isAuthenticated} user={user} authButtonMethod={login.bind(this)} /> 
          } />
          <Route exact path="/calendar" render={(props) => 
            <Calendar {...props} isAuthenticated={isAuthenticated} showNotify={setNotifyMessage.bind(this)} /> 
          } />
          <Route exact path="/posts" render={(props) => 
            <Posts {...props} user={user} isAuthenticated={isAuthenticated} showNotify={setNotifyMessage.bind(this)} />
          } />
          <Route exact path="/reacttableexample" render={(props) => 
            <ReactTable {...props} user={user} isAuthenticated={isAuthenticated} showNotify={setNotifyMessage.bind(this)} />
          } />
          <Route exact path="/tag" render={(props) => 
            <TagInputDisplay {...props} user={user} isAuthenticated={isAuthenticated} showNotify={setNotifyMessage.bind(this)} />
          } />
        </Container>
      </div>
    </Router>
  )

}

export default App;