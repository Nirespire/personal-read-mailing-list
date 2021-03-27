
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
var nodemailer = require('nodemailer');
const Email = require('email-templates');

const { Record } = require('./db/models')
const { getRecords, mapRecordsToList, saveRecord } = require('./db/util')

const { emailConfig } = require('./emails/config')

require('dotenv').config()
require('./db/init').init()

const app = express()

const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
    email: yup.string().email().required()
})

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

app.use((error, req, res, next) => {
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

app.get('/:email/posts', async (req, res, next) => {

    try {
        const email = req.params['email']

        console.log(`Looking up records for ${email}`)

        const records = await getRecords(email)

        res.send(JSON.stringify(records))
    } catch (error) {
        next(error)
    }

})

app.get('/:email/triggerEmail', async (req, res) => {

    const email = req.params['email']

    const records = await getRecords(email)

    emailConfig
        .send({
            template: 'articleList',
            message: {
                to: email
            },
            locals: {
                name: 'Sanj',
                urls: mapRecordsToList(records)
            }
        })
        .then(console.log)
        .catch(console.error);

    res.send('ok')
});

app.post('/save', async (req, res, next) => {
    const { url, email } = req.body;

    await schema.validate({
        url, email
    })

    try {
        const record = await saveRecord(url, email)

        res.send(record.toJSON())
    } catch (error) {
        next(error)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})