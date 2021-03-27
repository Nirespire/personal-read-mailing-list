const { db } = require('./config')

const mapRecordsToList = (records) => {
    return records.map(record => {
        return record.getDataValue('url')
    })
}

const getRecords = async (email) => {
    const records = await db.models.Record.findAll({
        where: {
            email: email
        }
    })
    return records
}

const saveRecord = async (url, email) => {

    await db.sync()

    const record = await db.models.Record.create({
        url: url,
        email: email
    })

    return record
}

module.exports = { getRecords, mapRecordsToList, saveRecord }