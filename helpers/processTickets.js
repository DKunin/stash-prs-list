'use strict';
var http = require('http');

module.exports = function(auth, host) {
    return function(pullRequestObject) {
        return new Promise(function(resolve, reject) {
            const keys = pullRequestObject.issues
                .map(singleIssue => singleIssue.key)
                .join('&issueKey=');

            var options = {
                host,
                path: `/rest/jira-integration/latest/issues?fields=status&minimum=10&issueKey=${keys}`,
                headers: {
                    Authorization: 'Basic ' + auth,
                    'Content-Type': 'application/json'
                }
            };
            http
                .get(options, function(response) {
                    var str = '';
                    response.on('data', function(chunk) {
                        str += chunk;
                    });

                    response.on('end', function() {
                        resolve(
                            Object.assign({}, pullRequestObject, {
                                statuses: JSON.parse(str)
                            })
                        );
                    });
                })
                .on('error', function(e) {
                    reject(e);
                });
        });
    };
};
