# Nimbly Lite Child
***

## Requirements

1. Create a HubSpot development sandbox for testing and development purposes. [Link](https://app.hubspot.com/signup-hubspot/cms-developers)

2. Create a personal CMS access key to enable authenticated access to your account. [Link](https://app.hubspot.com/l/personal-access-key)

### Quick start

1. `npm install` - install all development dependencies
2. Add to `.env` file your portal name and `PERSONAL_ACCESS_KEY` [Read more](#custom-multi-account-authentication)
3. `npm run upload` - upload all local changes to remote HubSpot portal (one-directional sync [local development -> Hubspot])

***

## Other commands

- `npm run watch` - watch process to automatically upload all local changes to remote HubSpot portal
- `npm run upload` - upload all local changes to remote HubSpot portal
- `npm run build` - to build and compile all local CSS and JS assets. It is included on `upload` command.
- `npm run fetchModules` - fetch only **published** modules from remote HubSpot portal. _Be careful with this command because it will rewrite all local changes._
- `npm run fetchAll` - fetch all **published** changes from remote HubSpot portal. _Be careful with this command because it will rewrite all local changes._
- `npm test` - run all tests locally


## Custom multi-account authentication

1. add `.env` file to your theme
2. add the name of the portal with the prefix `hub_` as the variable name and the `personal access key` as the variable value
3. Run Hubspot Theme commands (fetch, upload, watch)

### `.env` file example

```
hub_sandbox=personal_access_key
hub_project1=personal_access_key
hub_project2=personal_access_key
```
