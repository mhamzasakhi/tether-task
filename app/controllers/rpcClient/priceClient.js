// scripts/rpcClient/priceClient.js
const RPC = require('protomux-rpc');
const Hyperswarm = require('hyperswarm');
const goodbye = require('graceful-goodbye');

const swarm = new Hyperswarm();
const rpc = new RPC();

const topic = Buffer.alloc(32).fill('price-feed');

swarm.join(topic, { lookup: true, announce: false });

swarm.on('connection', (socket) => {
    rpc.attach(socket);

    const client = rpc.createClient();

    client.request('getPrices', null, (err, prices) => {
        if (err) return console.error('Error fetching prices:', err);
        console.log('Latest Prices:', prices);
        goodbye();
    });
});
