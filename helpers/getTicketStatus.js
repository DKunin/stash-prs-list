'use strict';

var http = require('http');

module.exports = function(auth, issue, host) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            path: '/rest/jira-integration/latest/issues?fields=status,-comment&minimum=10&issueKey=' +
                issue,
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
                    resolve(JSON.parse(str));
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
