module.exports = {
    processPrs: require('./processPrs'),
    approvePr: require('./approvePr'),
    slackPost: require('./slackPost'),
    getRequests: require('./getPullRequests'),
    mineWeight: bool => (bool ? 1 : 0),
    simpleFlatten: array =>
        array.reduce((newAry, oldArr) => newAry.concat(oldArr), []),
    cors: function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    }
};
