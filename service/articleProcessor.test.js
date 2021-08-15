const { getArticleSummary } = require('./articleProcessor');

test('getArticleSummary', async () => {
    const result = await getArticleSummary('https://tech.marksblogg.com/meilisearch-full-text-search.html');
    console.log(result);
});