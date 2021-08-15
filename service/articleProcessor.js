const extractor = require('unfluff');
const axios = require('axios').default;

const getArticleSummary = async (url) => {
    try {
        const response = await axios.get(url);
        const summary = extractor(response.data, 'en');
        summary.url = url;
        return summary;

      } catch (error) {
        console.error(error);
        return error;
      }
};


module.exports = { getArticleSummary };