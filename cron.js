const cronJobs = require('node-cron');
// const { testCronjob } = require('./app/cron/test');
const { runPriceJob } = require('./app/cron/priceCron');

// testCronjob.start();
console.log('Starting scheduled price job...');
setInterval(runPriceJob, 30 * 1000); // every 30 seconds
runPriceJob(); // run immediately on start

module.exports.cronJobs = cronJobs;



