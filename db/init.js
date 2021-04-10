const { db } = require('./config')

async function seedData() {
    await db.sync()

    const userId = '50bb9bd6-023f-4bbd-acf0-8a19707254e1'

    await db.models.User.create({
        id: userId,
        email: "email@email.com"
    })
    
    await db.models.Record.create({
        url: "https://google.com",
        publishDate: new Date(),
        userId: userId
    })
    
    if(process.env.DEBUG_EMAIL) {
        const userId2 = '50bb9bd6-023f-4bbd-acf0-8a19707254e2'
        await db.models.User.create({
            id: userId2,
            email: process.env.DEBUG_EMAIL
        })

        await db.models.Record.create({
            url: "https://news.ycombinator.com",
            publishDate: new Date(),
            userId: userId2
        })
    }


    console.log(new Date())
}

async function init() {
    if(process.env.NODE_ENV !== 'production') {
        (async () => {await seedData()})()
    }   
}

module.exports = { init }