const implementjs = require('implement-js')
const { Interface, type } = implementjs

const IServiceBuilder = Interface('Service') ({
    buildService: type('function')
},{
    error: true
})

module.exports.IServiceBuilder = IServiceBuilder