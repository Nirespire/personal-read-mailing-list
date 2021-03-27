require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
var nodemailer = require('nodemailer');

const app = express()

const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
    email: yup.string().email().required()
})

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

class Record extends Model { }
Record.init({
    url: DataTypes.STRING,
    email: DataTypes.STRING
}, { sequelize, modelName: 'record' })

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
        user: 'apikey',
        pass: process.env.EMAIL_API_KEY
    }
});

const mailOptions = {
    from: 'em9885@sanjaynair.dev',
    to: 'email@sanjaynair.dev',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

app.get('/email', (req, res) => {
    if (!process.env.EMAIL_BLOCK) {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } else {
        console.log('email block enabled, not sending')
    }

    res.send('ok')
});

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

        const records = await Record.findAll({
            where: {
                email: email
            }
        })

        res.send(JSON.stringify(records))
    } catch (error) {
        next(error)
    }

})

app.post('/save', async (req, res, next) => {
    const { url, email } = req.body;

    try {
        await schema.validate({
            url, email
        })

        await sequelize.sync()

        const record = await Record.create({
            url: url,
            email: email
        })

        res.send(record.toJSON())
    } catch (error) {
        next(error)
    }
})

async function seedData() {
    await sequelize.sync()

    Record.create({
        url: "http://something.com",
        email: "email@email.com"
    })
}

seedData()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})