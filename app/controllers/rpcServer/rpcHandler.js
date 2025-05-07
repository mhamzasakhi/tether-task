// scripts/rpcServer/rpcHandler.js
const { readPricesFromDB } = require('../utils/dbUtils'); // helper to read from RocksDB
const { fetchCurrentPrices } = require('../utils/fetchUtils'); // optional live fetcher

module.exports = {
    ping: (params, cb) => {
        cb(null, 'pong');
    },

    getPrices: async (params, cb) => {
        try {
            const latest = await readPricesFromDB('latest'); // assumes 'latest' key used by cron
            cb(null, latest);
        } catch (err) {
            cb(err);
        }
    },

    getPriceHistory: async (params, cb) => {
        try {
            const { symbol } = params;
            if (!symbol) return cb(new Error('Symbol is required'));

            const history = await readPricesFromDB(`history:${symbol.toLowerCase()}`);
            cb(null, history);
        } catch (err) {
            cb(err);
        }
    }
};
