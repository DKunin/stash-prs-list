'use strict';
var http = require('http');

module.exports = function(auth, host, query) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            path: `/rest/jira/latest/projects/${query.project}/repos/${query.repo}/pull-requests/${query.pullRequestId}/issues`,
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
                    resolve({
                        pullRequestId: query.pullRequestId,
                        issues: JSON.parse(str)
                    });
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
