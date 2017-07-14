'use strict';
var http = require('http');

module.exports = function(auth, project, host) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            path: '/rest/api/1.0/projects/' +
                project +
                '/pull-requests?limit=100',
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
