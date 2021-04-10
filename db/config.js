const { Sequelize } = require('sequelize');
const path = require('path')

const dbPath = path.join(__dirname, '/tmp', 'test_db.sqlite')

const db = process.env.NODE_ENV === 'production' || process.env.DEBUG_DB === 'true' ? new Sequelize(`sqlite::${dbPath}`) : new Sequelize('sqlite::memory:');

module.exports = { db }