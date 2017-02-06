module.exports = {
    processPrs: require('./processPrs'),
    getRequests: require('./getPullRequests'),
    mineWeight: bool => bool ? 1 : 0,
    simpleFlatten: array => 
        array.reduce((newAry, oldArr) => newAry.concat(oldArr), [])
};