const { DataTypes } = require('sequelize');
const { db } = require('./config')

const Record = db.define('Record', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = { Record }