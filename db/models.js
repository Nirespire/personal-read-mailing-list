const { DataTypes, Sequelize } = require('sequelize');
const { db } = require('./config');

const Record = db.define('Record', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUIDV4,
        key: true,
        allowNull: false
    },
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const User = db.define('User', {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = { Record, User };