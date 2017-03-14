module.exports = function(data, auth, host, userName) {
    if (!data) {
        return [];
    }
    var onlyMine = data
        .filter(function(singlePR) {
            return singlePR.author.user.name === userName;
        })
        .map(function(singlePr) {
            return Object.assign(singlePr, { mine: true });
        });

    var onReview = data
        .filter(function(singlePR) {
            const singleArray = singlePR.reviewers.concat(
                singlePR.participants
            );
            const isReviewerOrParticipant = Boolean(
                singleArray.filter(function(singleReviewer) {
                    return singleReviewer.user.name === userName;
                }).length
            );

            return isReviewerOrParticipant;
        })
        .map(function(singlePr) {
            return Object.assign(singlePr, { mine: false });
        });

    return onlyMine.concat(onReview);
};
