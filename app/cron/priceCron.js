const { storeLatestPrices } = require('../lib/hyperStore');
const { fetchAllPrices } = require('../services/priceAggregator/fetchPrices');

const runPriceJob = async () => {
    console.log(`[${new Date().toISOString()}] Running price aggregation job...`);
    const priceData = await fetchAllPrices();
    if (!priceData.length) {
        console.warn('No data fetched. Skipping store.');
        return;
    }
    await storeLatestPrices(priceData);
    console.log(`Stored prices for ${priceData.length} currencies.`);
};

// Run immediately if script is called directly
if (require.main === module) {
    runPriceJob();
}

module.exports = { runPriceJob };
