const { v4: uuid} = require('uuid');
const { db } = require('./config');

const mapRecordsToUrlList = (records) => {
    return records.map(record => {
        return record.getDataValue('url');
    });
};

const getRecords = async (userId) => {

    await db.sync();
    
    const records = await db.models.Record.findAll({
        where: {
            userId: userId
        }
    });
    return records;
};

const createUser = async (email) => {

    await db.sync();

    const user = await db.models.User.create({
        id: uuid(),
        email: email
    });

    return user;
};

const getUserInfoById = async (userId) => {

    await db.sync();

    const info = await db.models.User.findOne({
        where: {
            id: userId
        }
    });
    return info;
};

const getUserInfoByEmail = async (email) => {

    await db.sync();

    const info = await db.models.User.findOne({
        where: {
            email: email
        }
    });
    return info;
};

const saveRecord = async (url, userId, publishDate) => {

    await db.sync();

    const record = await db.models.Record.create({
        url: url,
        userId: userId,
        publishDate: publishDate
    });

    return record;
};

module.exports = { getRecords, mapRecordsToUrlList, saveRecord, getUserInfoByEmail, getUserInfoById, createUser };