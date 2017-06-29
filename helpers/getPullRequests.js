'use strict';
var http = require('http');

module.exports = function(auth, project, host) {
    return new Promise(function(resolve, reject) {
        var options = {
            host,
            // http://stash.msk.avito.ru/rest/api/latest/dashboard/pull-requests?state=open&role[]=author&role[]=REVIEWER&role[]=participant&limit=100
            path: (
                '/rest/api/1.0/projects/' + project + '/pull-requests?limit=100&state=merged'
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
