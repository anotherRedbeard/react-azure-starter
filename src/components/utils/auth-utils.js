import { UserAgentApplication } from 'msal';
import config from './config';

const msalApp = new UserAgentApplication({
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

export default msalApp;