const implementjs = require('implement-js')
const { Interface, type } = implementjs

const IRandomStrategy = Interface('Random') ({
    getRandomX: type('function')
},{
    error: true
})

module.exports.IRandomStrategy = IRandomStrategy