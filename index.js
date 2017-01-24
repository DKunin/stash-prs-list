'use strict';
const express = require('express');
const app = express();
const {
    processPrs,
    getMergability,
    getRequests,
    mineWeight,
    simpleFlatten
} = require('./helpers');
const PORT = 4848;
const { JIRA_PASS, STASH_HOST } = process.env;
const PROJECTS = process.argv.slice(2, process.argv.length);
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
                .then(result => {
                    return result.sort((a, b) => {
                        return a.title.indexOf('WIP') - b.title.indexOf('WIP') +
                            (mineWeight(b.mine) - mineWeight(a.mine));
                    });
                })
                .then(result => res.json(result));
        })
        .catch(function(error) {
            res.send(error);
        });
});

app.listen(PORT);

console.log(`Started service on port ${PORT}`);