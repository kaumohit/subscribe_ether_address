const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown('../LevelDBStorage'));

module.exports = db;