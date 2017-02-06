module.exports = function(data, auth, host, userName) {
    var onlyMine = data
        .filter(function(singlePR) {
            return singlePR.author.user.name === userName;
        })
        .map(function(singlePr) {
            return Object.assign(
                singlePr,
                { mine: true }
            )
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
            return Object.assign(
                singlePr,
                { mine: false }
            )
        });

    return onlyMine.concat(onReview);
};