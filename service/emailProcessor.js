const { getRecords, getUserInfoById, mapRecordsToUrlList } = require('../db/util');
const { getArticleSummary } = require('../service/articleProcessor');
const { emailConfig } = require('../emails/config');

const triggerEmailSummaryForUser = async (userId) => {
    const info = await getUserInfoById(userId);

    if(!info) {
        throw new Error('User not found');
    }

    const records = await getRecords(userId);
    const urls = mapRecordsToUrlList(records);
    const summaries = await Promise.all(urls.map(async (url) => { return await getArticleSummary(url); }));

    console.log('summaries', summaries);
    
    emailConfig
        .send({
            template: 'articleList',
            message: {
                to: info.email
            },
            locals: {
                name: 'Sanj',
                summaries: summaries
            }
        })
        .then(console.log)
        .catch(console.error);
};

module.exports = { triggerEmailSummaryForUser };