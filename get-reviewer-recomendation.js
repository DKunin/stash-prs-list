'use strict';

const express = require('express');
const app = express();
const PORT = 1428;
const { getRequests, simpleFlatten, cors } = require('./helpers');

app.use(cors);
const fs = require('fs');
const { JIRA_PASS, STASH_HOST, STASH_PROJECTS } = process.env;
const PROJECTS = STASH_PROJECTS.split(' ');

function processArrayOfPrsAndConcat(arrayOfPrs) {
    return simpleFlatten(arrayOfPrs.map(({ values }) => values));
}
const reviewers = fs
    .readFileSync('./stash-users')
    .toString()
    .split('\n')
    .filter(Boolean)
    .reduce(function(newObject, singleReviewer) {
        return Object.assign(newObject, {
            [singleReviewer.trim()]: { prsCount: 0 }
        });
    }, {});

function generateRequests(project) {
    return getRequests(JIRA_PASS, project, STASH_HOST);
}

function getPullRequests() {
    return new Promise(resolve => {
        Promise.all(PROJECTS.map(generateRequests))
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                console.log(error);
                resolve([]);
            });
    });
}

app.get('/api/getreviewers', function(req, res) {
    getPullRequests().then(result => {
        const parsedResult = processArrayOfPrsAndConcat(result);
        const recount = Object.keys(
            reviewers
        ).reduce((newObject, singleReviewer) => {
            const reviewCount = parsedResult.filter(singleReview => {
                return singleReview.reviewers.find(reviewer => {
                    return reviewer.user.name === singleReviewer;
                });
            });
            return Object.assign(reviewers, {
                [singleReviewer]: { prsCount: reviewCount.length }
            });
        }, reviewers);
        const sorted = Object.keys(recount)
            .reduce((newArray, singleReviewer) => {
                return newArray.concat({
                    name: singleReviewer,
                    prsCount: recount[singleReviewer].prsCount
                });
            }, [])
            .sort((a, b) => (a.prsCount <= b.prsCount ? -1 : 1));
        res.send(sorted);
    });
});

app.listen(PORT);
