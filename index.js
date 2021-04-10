require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
// TODO move this initialization to /db
const { Record } = require('./db/models')
const { getRecords, mapRecordsToList, saveRecord, getUserInfoByEmail, getUserInfoById, createUser } = require('./db/util')

const { emailConfig } = require('./emails/config')


require('./db/init').init()

const app = express()

// const schema = yup.object().shape({
//     url: yup.string().trim().url().required(),
//     email: yup.string().email().required()
// })

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

app.use((error, req, res, next) => {
    console.error(JSON.stringify(error))
    if (error.status) {
        res.status(error.status)
    } else {
        res.status(500)
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'no' : error.stack
    })
})

app.post('/createUser', async(req, res, next) => {
    try {
        const { email } = req.body

        console.log(`Creating user with ${email}`)

        const info = await getUserInfoByEmail(email)

        if(!info) {
            const user = await createUser(email)
            res.status(201).send(JSON.stringify(user))
        } else {
            throw new Error(`User with email ${email} already exists`)
        }

        
    } catch (error) {
        next(error)
    }
})

app.get('/:email/info', async(req, res, next) => {
    try {
        const email = req.params['email']

        console.log(`Looking up info for ${email}`)

        const info = await getUserInfoByEmail(email)

        res.send(JSON.stringify(info))
    } catch (error) {
        next(error)
    }
})

app.get('/:userId/articles', async (req, res, next) => {

    try {
        const userId = req.params['userId']

        console.log(`Looking up records for ${userId}`)

        const records = await getRecords(userId)

        res.send(JSON.stringify(records))
    } catch (error) {
        next(error)
    }

})

app.post('/saveArticle', async (req, res, next) => {
    const { url, userId, publishDate } = req.body;

    // await schema.validate({
    //     url, userId, publishDate
    // })

    try {
        const record = await saveRecord(url, userId, publishDate)

        res.send(record.toJSON())
    } catch (error) {
        next(error)
    }
})



app.get('/:userId/triggerEmail', async (req, res, next) => {

    const userId = req.params['userId']

    try {

        const info = await getUserInfoById(userId)

        if(!info) {
            throw new Error(`User not found`)
        }

        const records = await getRecords(userId)
        
        emailConfig
            .send({
                template: 'articleList',
                message: {
                    to: info.email
                },
                locals: {
                    name: 'Sanj',
                    urls: mapRecordsToList(records)
                }
            })
            .then(console.log)
            .catch(console.error);

        res.send('ok')
    }
    catch(error) {
        next(error)
    }
});



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})