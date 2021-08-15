require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { getRecords, saveRecord, getUserInfoByEmail, createUser } = require('./db/util');
const { triggerEmailSummaryForUser } = require('./service/emailProcessor');



require('./db/init').init();

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

app.use((error, req, res) => {
    console.error(JSON.stringify(error));
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'no' : error.stack
    });
});

app.post('/createUser', async(req, res, next) => {
    try {
        const { email } = req.body;

        console.log(`Creating user with ${email}`);

        const info = await getUserInfoByEmail(email);

        if(!info) {
            const user = await createUser(email);
            res.status(201).send(user);
        } else {
            throw new Error(`User with email ${email} already exists`);
        }

        
    } catch (error) {
        next(error);
    }
});

app.get('/:email/info', async(req, res, next) => {
    try {
        const email = req.params['email'];

        console.log(`Looking up info for ${email}`);

        const info = await getUserInfoByEmail(email);

        res.send(info);
    } catch (error) {
        next(error);
    }
});

app.get('/:userId/articles', async (req, res, next) => {

    try {
        const userId = req.params['userId'];

        console.log(`Looking up records for ${userId}`);

        const records = await getRecords(userId);

        res.send(records);
    } catch (error) {
        next(error);
    }

});

app.post('/saveArticle', async (req, res, next) => {
    const { url, userId, publishDate } = req.body;

    try {
        const record = await saveRecord(url, userId, publishDate);

        res.send(record.toJSON());
    } catch (error) {
        next(error);
    }
});



app.get('/:userId/triggerEmail', async (req, res, next) => {

    const userId = req.params['userId'];

    try {

        await triggerEmailSummaryForUser(userId);

        res.send('ok');
    }
    catch(error) {
        next(error);
    }
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});