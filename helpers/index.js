module.exports = {
    processPrs: require('./processPrs'),
    getMergability: require('./getMergability'),
    getRequests: require('./getPullRequests'),
    mineWeight: bool => bool ? 1 : 0,
    simpleFlatten: array => 
        array.reduce((newAry, oldArr) => newAry.concat(oldArr), [])
};