const { db } = require('./config')

async function seedData() {
    await db.sync()

    await db.models.Record.create({
        url: "https://google.com",
        email: process.env.DEBUG_EMAIL
    })
}

async function init() {
    if(process.env.NODE_ENV !== 'production') {
        (async () => {await seedData()})()
    }   
}

module.exports = { init }