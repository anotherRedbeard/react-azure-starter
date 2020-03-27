module.exports = {
    appId: process.env.REACT_APP_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URL,
    scopes: [
        'user.read',
        'calendars.read',
        'group.read.all'
    ],
    authority: process.env.REACT_APP_AUTHORITY,
    lagoonApiUrl: process.env.REACT_APP_LAGOON_API_BASE_URL,
    lagoonApiCode: process.env.REACT_APP_LAGOON_API_CODE,
    showDebugMessages: process.env.REACT_APP_SHOW_DEBUG_MESSAGES,
    isAdminGroupId: process.env.REACT_APP_IS_ADMIN_ID
};