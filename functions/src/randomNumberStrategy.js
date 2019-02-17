const implementjs = require('implement-js')
const implement = implementjs.default
const IRandomStrategy = require('./randomStrategy').IRandomStrategy
const max = require('./constants').MAX_NUMBER;
const min = require('./constants').MIN_NUMBER;

function RandomNumberStrategy() {
    this.getRandomX = function() {
        const random = Math.floor(Math.random() * (max - min)) + min; 
        return random;
    }
}

const randomNumberStrategy = implement(IRandomStrategy)(new RandomNumberStrategy());
module.exports.randomNumberStrategy = randomNumberStrategy
module.exports.RandomNumberStrategy = RandomNumberStrategy
