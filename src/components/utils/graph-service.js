var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}

export async function getUserGroups(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const response = await client.api('/me/memberOf').select('displayName','id').get();
  return response;
}

export async function getUserPhoto(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  //get image as raw type so you can convert to base64 string
  const response = await client.api('/me/photos(\'48x48\')/$value').responseType('raw').get();
  if (response.ok) {
    //convert arrayBuffer to base 64 string
    var buffer = await response.arrayBuffer();
    var base64Flag = 'data:image/jpeg;base64,';
    var imageStr = arrayBufferToBase64(buffer);
    return base64Flag+imageStr;
  } else {
    return null;
  }
}

export async function getEvents(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client.api('/me/events').select('subject, organizer,start,end').orderby('createdDateTime DESC').get();
    return events;
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
}