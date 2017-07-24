'use strict';
var http = require('http');

module.exports = function(auth, project, host, pullRequestId, originalPr) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            path: '/rest/api/1.0/projects/' +
                project +
                '/pull-requests/' +
                pullRequestId +
                '/diff?contextLines=1',
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
                    let resultingJson = {};
                    try {
                        resultingJson = JSON.parse(str);
                    } catch (err) {
                        resultingJson = {};
                    }
                    resolve(Object.assign(resultingJson, { originalPr }));
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
