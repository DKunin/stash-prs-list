'use strict';
var http = require('http');

module.exports = function(pullRequestId, auth, host) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            path: '/rest/api/latest/projects/AV/repos/avito-site/pull-requests/' +
                pullRequestId +
                '/merge',
            headers: {
                Authorization: 'Basic ' + auth,
                'Content-Type': 'application/json'
            }
        };
        http.get(options, function(response) {
            var str = '';
            response.on('data', function(chunk) {
                str += chunk;
            });

            response.on('end', function() {
                resolve(str);
            });
        }).on('error', function(e) {
            reject(e);
        });
    });
};