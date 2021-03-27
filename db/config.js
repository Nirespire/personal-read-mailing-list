const { Sequelize } = require('sequelize');
const path = require('path')

const dbPath = path.join(__dirname, '/tmp', 'test_db.sqlite')

const db = new Sequelize(`sqlite::${dbPath}`);

module.exports = { db }