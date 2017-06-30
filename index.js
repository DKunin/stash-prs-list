'use strict';

const express = require('express');
const app = express();

const {
    processPrs,
    getRequests,
    simpleFlatten,
    approvePr,
    cors
} = require('./helpers');

const PORT = 4848;
const { JIRA_PASS, STASH_HOST, STASH_PROJECTS } = process.env;
const PROJECTS = STASH_PROJECTS.split(' ').filter(Boolean);

app.use(cors);

function processArrayOfPrsAndConcat(arrayOfPrs, username) {
    return simpleFlatten(
        arrayOfPrs.map(singleResult =>
            processPrs(
                JSON.parse(singleResult).values,
                JIRA_PASS,
                STASH_HOST,
                username
            )
        )
    );
}

function generateRequests(project) {
    return getRequests(JIRA_PASS, project, STASH_HOST);
}

app.get('/api/prs', function(req, res) {
    const { username } = req.query;
    Promise.all(PROJECTS.map(generateRequests))
        .then(function(result) {
            Promise.all(
                processArrayOfPrsAndConcat(result, username)
            ).then(result => res.json(Array.isArray(result) ? result : []));
        })
        .catch(function(error) {
            console.log(error);
            res.send([]);
        });
});

app.post('/api/approve', function(req, res) {
    const { project, repo, pullRequestId } = req.query;
    approvePr(
        JIRA_PASS,
        project,
        STASH_HOST,
        repo,
        pullRequestId
    ).then(result => {
        res.send(result);
    });
});

app.listen(PORT);

console.log(
    `Started service on port http://localhost:${PORT}/api/prs?username=YOUR_USERNAME`
);
