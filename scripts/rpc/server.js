'use strict';
const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { getLatestPrices, getHistoricalPrices } = require('../../app/lib/hyperStore');

// Ensure dbPath resolves correctly
const dbPath = path.join(__dirname, '../../.db/rpc-server');

// Check if dbPath exists, if not, create the directory
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

const main = async () => {
    const feed = new Hypercore(dbPath);
    const db = new Hyperbee(feed, {
        keyEncoding: 'utf-8',
        valueEncoding: 'binary'
    });

    await db.ready();

    // DHT Seed
    let dhtSeed = (await db.get('dht-seed'))?.value;
    if (!dhtSeed) {
        dhtSeed = crypto.randomBytes(32);
        await db.put('dht-seed', dhtSeed);
    }

    const dht = new DHT({
        port: 40001,
        keyPair: DHT.keyPair(dhtSeed),
        bootstrap: [{ host: '127.0.0.1', port: 30001 }]
    });
    await dht.ready();

    // RPC Seed
    let rpcSeed = (await db.get('rpc-seed'))?.value;
    if (!rpcSeed) {
        rpcSeed = crypto.randomBytes(32);
        await db.put('rpc-seed', rpcSeed);
    }

    const rpc = new RPC({ seed: rpcSeed, dht });
    const server = rpc.createServer();
    await server.listen();

    console.log('RPC server public key:', server.publicKey.toString('hex'));

    server.respond('getLatestPrices', async (reqRaw) => {
        const req = JSON.parse(reqRaw.toString('utf-8'));
        const pairs = req.pairs || [];
        console.log(pairs);
        const data = await getLatestPrices(pairs);
        return Buffer.from(JSON.stringify(data), 'utf-8');
    });

    server.respond('getHistoricalPrices', async (reqRaw) => {
        const req = JSON.parse(reqRaw.toString('utf-8'));
        const { pairs, from, to } = req;
        const data = await getHistoricalPrices(pairs, from, to);
        return Buffer.from(JSON.stringify(data), 'utf-8');
    });
};

main().catch(console.error);
