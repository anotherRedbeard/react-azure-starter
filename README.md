# react-azure-starter

This is a simple react js hooks starter project that is using Azure AD to authenticate and the JSONPlaceholder to demo simple CRUD operations.  This project was created initially by following this tutorial (<https://docs.microsoft.com/en-us/graph/tutorials/react>)

## Prerequisites

1. Access to an azure subscription where you can create an app registration.  You can go here (<https://azure.microsoft.com/en-us/free/>) to sign-up for an account that is free for the first 12 months.
2. Office 365 tenant that is connected to your Azure subscription.

## Setup

1. Register the app in the Azure portal. You can find those instructions here (<https://docs.microsoft.com/en-us/graph/tutorials/react?tutorial-step=2>)
    1. Note where you can get the Application (client) ID because you will need that in a later step.
2. Clone repo.
3. Create a new .env.local file in the root directory and populate it with the following detail.  This will be used as your local config file for react

    ```text
    // .env.development.local
    REACT_APP_ID={Application (client) ID created above}
    REACT_APP_AUTHORITY=https://login.microsoftonline.com/{Azure tenant id that will match the tenant you created the app registration in}
    REACT_APP_REDIRECT_URL=http://localhost:3000
    REACT_APP_API_BASE_URL=https://jsonplaceholder.typicode.com/

    ```

4. Run the following commands

    ```bash
    $npm install
    $npm start
    ```

5. Login and start clicking

## Features

- AzureAD for Auth
- Sortable data hook
- Working example of multi-environment setup using .env.* files and env-cmd npm package.
  - For more info on this go here <https://medium.com/@rishi.vedpathak/react-environment-specific-builds-using-env-with-cra-and-env-cmd-5960a1253fe6>
  - It also changes the color of the navbar depending on the environment you are using
- react-table with sorting and pagination example
  - For more info on react-table please visit <https://github.com/tannerlinsley/react-table>
- Export to excel using the following libraries
  - file-saver <https://www.npmjs.com/package/file-saver>
  - xlsx <https://github.com/eligrey/FileSaver.js>

## Troubleshooting

- One of the problems you may run into is with granting admin permission.  The following is a great summary of the AADSTS90094 error and how to fix it.  The problem that is a little but under emphasized is that the Scopes must match exactly.  So if you have an additional scope you are requesting and it was not added to your app registration you will get misleading errors.
  - <https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/CallAnAPI/appId/56b53ce7-f14c-4ddf-a0d0-569a12717487/isMSAApp/>
  - As pointed out by the first comment in the post above, if your enterprise has turned off 'Users can consent to apps access company data on their behalf' then everything will require admin consent.
- This repo is setup to run in vscode on a Mac using the bash shell, if you need to run on Windows using PowerShell you will need to change the package.json to something like this for the start script:

  ```json
  "scripts": {
    "start": "set PORT=3000 && react-scripts start"
  }
  ```

## Additional Info

This project is using the JSONPlaceHolder API, which can be found here <https://jsonplaceholder.typicode.com>, to pull in random sample data to play with.  A couple of important things to note about this data source:

1. It's read-only.  It will provide fakes for inserts and updates, but you aren't really changing the source.  For example, if you create a new post and then try to edit that post, it will fail since the post you created was just a fake.
2. Actually there was only one important thing to note about using this data...