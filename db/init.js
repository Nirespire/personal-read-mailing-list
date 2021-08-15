const { db } = require('./config');

async function seedData() {
    await db.sync();

    const testData = [
        {
            userId: '50bb9bd6-023f-4bbd-acf0-8a19707254e1',
            email: 'email@email.com',
            urls: [
                'https://google.com'
            ]
        },
        {
            userId: '50bb9bd6-023f-4bbd-acf0-8a19707254e2',
            email: process.env.DEBUG_EMAIL || 'email2@email2.com',
            urls: [
                'https://tech.marksblogg.com/meilisearch-full-text-search.html',
                'https://www.nothingventured.com/the-rise-of-the-one-person-unicorn/',
                'https://www.bbc.com/future/article/20210810-the-man-growing-lettuce-for-space-station-salads'
            ]
        }
    ];

    for(var data in testData) {
        await db.models.User.create({
            id: testData[data].userId,
            email: testData[data].email
        });

        const urls = testData[data].urls; 

        for(var url in urls){
            await db.models.Record.create({
                url: urls[url],
                publishDate: new Date(),
                userId: testData[data].userId
            });
        }

    }
}

async function init() {
    if(process.env.NODE_ENV !== 'production') {
        (async () => {await seedData();})();
    }   
}

module.exports = { init };