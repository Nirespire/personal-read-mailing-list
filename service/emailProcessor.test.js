const { triggerEmailSummaryForUser } = require('./emailProcessor');

beforeAll(() => {
    require('../db/init').init();
});

test('triggerEmailSummaryForUser', async () => {
    const userId = '50bb9bd6-023f-4bbd-acf0-8a19707254e2';
    await triggerEmailSummaryForUser(userId);
});