'use strict';
var http = require('http');

module.exports = function(auth, project, host, repo, pullRequestId) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            method: 'POST',
            path: (
                `/rest/api/1.0/projects/${project}/repos/${repo}/pull-requests/${pullRequestId}/approve`
            ),
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
                    resolve(str);
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
