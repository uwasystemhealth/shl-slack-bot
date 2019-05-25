# SHL Slack Bot

For useful slack automations and memeber management.

## Current Commands

`/eotd` - Equation of the day, generates a latex post from user dialog for the eotd.

## Planned Commands

`/userperms` - Allow an administrator to configure a user's access to SHL services, if the app needs user details (github username, pheme, etc) the app will message the user to provide it.

## Install

To install, make sure your server/ports are publicly available.

Clone the repo and enter the directory.

Run Development:
```bash
$ npm i
$ npm run dev
```

Build for Production:
```bash
$ npm run build
```

Run Production:
```bash
$ node dist/src
```

## Setup Slack App

Create a [new slack app](https://api.slack.com/apps?new_app=1), in the `Basic Details` section:
- Configure the display information
- Copy the "Signing Secret", and paste it into the .env file, under `SLACK_SIGNING_SECRET`

Click on `Slash Commands` section
- Add the all of the current commands listed above
  - The endpoint for all of them should be `<server address>/slack/commands`

Click on `Interactive Componenets` section
- Enable it
- Add the Request URL `<server address>/slack/actions`

Click on `OAuth & Permissions` section
- Add the following permissions: `chat:write:bot`, `incoming-webhook`, `commands`
- Install the app on the workspace
- Copy the "OAuth Access Token", and paste it into the .env file, under `SLACK_ACCESS_TOKEN`
