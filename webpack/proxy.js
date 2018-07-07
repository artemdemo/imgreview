/* eslint-disable consistent-return, max-len */

const campaigns = require('./mock-data/campaigns.json');
const campaignsRegex = /\/api\/campaigns/;

module.exports = {
    '/api': {
        bypass: (req, res) => {
            const testUrl = (urlRegex, method = 'GET') => urlRegex.test(req.url) && req.method === method;

            switch (true) {
                case testUrl(campaignsRegex):
                    res.json(campaigns);
                    return true;
                default:
                    return '/index.html';
            }
        },
    },
};
