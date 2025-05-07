// scripts/rpcClient/historyClient.js
const RPC = require('protomux-rpc');
const Hyperswarm = require('hyperswarm');
const goodbye = require('graceful-goodbye');

const swarm = new Hyperswarm();
const rpc = new RPC();

const topic = Buffer.alloc(32).fill('price-history');

swarm.join(topic, { lookup: true, announce: false });

swarm.on('connection', (socket) => {
    rpc.attach(socket);

    const client = rpc.createClient();

    // You could pass query params here, e.g., coin ID or date range
    const query = { symbol: 'btc' };

    client.request('getPriceHistory', query, (err, history) => {
        if (err) return console.error('Error fetching history:', err);
        console.log('Historical Prices:', history);
        goodbye();
    });
});
