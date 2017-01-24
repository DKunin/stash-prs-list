var getMergability = require('./getMergability');

module.exports = function(data, auth, host, userName) {
    var onlyMine = data
        .filter(function(singlePR) {
            return singlePR.author.user.name === userName;
        })
        .map(function(singlePr) {
            return new Promise(function(resolve) {
                getMergability(
                    singlePr.id,
                    auth,
                    host
                ).then(function(mergability) {
                    resolve(
                        Object.assign(
                            singlePr,
                            { mergability: JSON.parse(mergability) },
                            { mine: true }
                        )
                    );
                });
            });
        });

    var onReview = data
        .filter(function(singlePR) {
            return Boolean(
                singlePR.reviewers.filter(function(singleReviewer) {
                    return singleReviewer.user.name === userName;
                }).length
            );
        })
        .map(function(singlePr) {
            return new Promise(function(resolve) {
                getMergability(
                    singlePr.id,
                    auth,
                    host
                ).then(function(mergability) {
                    resolve(
                        Object.assign(
                            singlePr,
                            { mergability: JSON.parse(mergability) },
                            { mine: false }
                        )
                    );
                });
            });
        });

    return onlyMine.concat(onReview);
};