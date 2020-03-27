import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import NavBar from '../packages/navbar';
import NotifyUser from '../packages/notify-user';
import Welcome from '../welcome/welcome';
import 'bootstrap/dist/css/bootstrap.css';
import config from '../utils/config';
import { UserAgentApplication } from 'msal';
import { getUserDetails, getUserPhoto, getUserGroups } from '../utils/graph-service';
import Calendar from '../calendar/calendar';
import PipelineSystem from '../pipeline-system/pipeline-system';
import Facility from '../facility/facility';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faQuestionCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faCheckCircle, faQuestionCircle, faExclamationCircle);

class App extends Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication({
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

    var user = this.userAgentApplication.getAccount();

    this.state = {
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };

    if (user) {
      //Enhance user object with data from Graph
      this.getUserProfile();
    }
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account",
          authority: config.authority
        });

        window.location.reload(false);
    }
    catch (err) {
      var error = {}

      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
        { message: errParts[1], debug: errParts[0] } :
        { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }
    }

    this.setState({
      isAuthenticated: false,
      user: {},
      error: error
    });
  }

  logout() {
    this.userAgentApplication.logout();
  }

  isUserInAdminRole(userRoles) {
    return userRoles.some(userRole => userRole.id === config.isAdminGroupId);
  }

  async getUserProfile() {
    try {
      //Get the access token silently. If the cache contains a non-expired token, this function will just return the cached token. Otherwise, it will make a request to the Azure OAuth endpoint to get a token
      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes,
        authority: config.authority
      });

      if (accessToken) {
        var [user, photo, userGroups] = await Promise.all([ getUserDetails(accessToken), getUserPhoto(accessToken), getUserGroups(accessToken)]);

        var isUserAdmin = this.isUserInAdminRole(userGroups.value);
        this.setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.email || user.userPrincipalName,
            avatar: photo,
            isAdmin: isUserAdmin
          },
          error: null
        });

      }
    }
    catch(err) {
      var error = {};
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }

  render() {
    let notify = null;
    if (this.state.notify) {
      notify = <NotifyUser message={this.state.notify.message} reactstrapColor={this.state.notify.color} debug={this.state.notify.debug} />
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
            user={this.state.user}/>
          <Container>
            {notify}
            <Route exact path="/"
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  authButtonMethod={this.login.bind(this)} />
              } />
            <Route exact path="/calendar"
              render={(props) =>
                <Calendar {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  showNotify={this.setNotifyMessage.bind(this)} />
              } />
            <Route exact path="/facility" render={(props) => <Facility {...props} user={this.state.user} isAuthenticated={this.state.isAuthenticated} showNotify={this.setNotifyMessage.bind(this)} />} />
            <Route exact path="/systems"
              render={(props) =>
                <PipelineSystem {...props}
                  user={this.state.user}
                  isAuthenticated={this.state.isAuthenticated}
                  showNotify={this.setNotifyMessage.bind(this)} />
              } />
          </Container>
        </div>
      </Router>
    );
  }

  setNotifyMessage(color, message, debug) {
    this.setState({
      notify: {message:message, color:color, debug:debug}
    });
  }
}

export default App;