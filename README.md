# Stash Pull Requests lists

> Simple proxy, to get the API, and combine pull-requests with mergin info, and narrrowing down to a single user.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Install

```console
    git clone git@github.com:DKunin/stash-prs-list.git
    cd stash-prs-list
    npm prepeare
```
npm prepeare will create .projects file for you, there you should put links PR projects you are interested in.

Before usage JIRA_PASS and STASH_HOST env variables should be set in your .bashrc file, or any other place, you use to declare variables. JIRA_PASS is base64 encoded your 'username:password'.

```bash
    export JIRA_PASS='ZnJlZDpmcmVk' 
    export STASH_HOST='www.stash.com'
```

```console
    npm start
```

Or with Docker

```console
    docker pull dkunin/stash-prs-list
    docker run docker run -p 4848:4848 -e JIRA_PASS=$JIRA_PASS -e STASH_HOST=$STASH_HOST -d dkunin/stash-prs-list
```

Or if you want to modify/build your own image

```console
    npm run docker-image-build 
    npm run docker-image-start
```
which will run:
```console
    docker build ./ -t $(whoami)/$(basename $PWD)
    docker run -p 4848:4848 -e JIRA_PASS=$JIRA_PASS -e STASH_HOST=$STASH_HOST -d $(whoami)/$(basename $PWD)
```

## Usage

Go to address:
```
    http://localhost:4848/api/prs?username=dkunin
```

## License

MIT © Dmitri Kunin
