// scripts/rpcClient/pingClient.js
const RPC = require('protomux-rpc');
const Hyperswarm = require('hyperswarm');
const goodbye = require('graceful-goodbye');

const swarm = new Hyperswarm();
const rpc = new RPC();

const topic = Buffer.alloc(32).fill('ping-test');

swarm.join(topic, { lookup: true, announce: false });

swarm.on('connection', (socket) => {
    rpc.attach(socket);

    const client = rpc.createClient();

    client.request('ping', null, (err, res) => {
        if (err) return console.error('Ping failed:', err);
        console.log('Ping response:', res);
        goodbye();
    });
});
