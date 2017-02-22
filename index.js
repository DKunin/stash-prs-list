'use strict';
const express = require('express');
const fs = require('fs');
const app = express();

const { processPrs, getRequests, simpleFlatten, cors } = require('./helpers');

const PORT = 4848;
const { JIRA_PASS, STASH_HOST } = process.env;
const PROJECTS = fs.readFileSync('./.projects').toString().split('\n').filter(Boolean);

app.use(cors);

function processArrayOfPrsAndConcat(arrayOfPrs, username) {
    return simpleFlatten(
        arrayOfPrs.map(
            singleResult =>
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
    Promise
        .all(PROJECTS.map(generateRequests))
        .then(function(result) {
            Promise
                .all(processArrayOfPrsAndConcat(result, username))
                .then(result => res.json(Array.isArray(result) ? result : []));
        })
        .catch(function(error) {
            console.log(error);
            res.send([]);
        });
});

app.listen(PORT);

console.log(`Started service on port http://localhost:${PORT}/api/prs?username=YOUR_USERNAME`);
