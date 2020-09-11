module.exports = {
    appId: process.env.REACT_APP_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URL,
    scopes: [
        'user.read',
        'calendars.read'
    ],
    authority: process.env.REACT_APP_AUTHORITY,
    jsonApiUrl: process.env.REACT_APP_API_BASE_URL,
    showDebugMessages: process.env.REACT_APP_SHOW_DEBUG_MESSAGES,
    env: process.env.REACT_APP_ENV,
    aiInstrumentationKey: process.env.REACT_APP_INSIGHTS_KEY
};