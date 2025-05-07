'use strict';
const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, '../../.db/rpc-client');

const initDHTAndRPC = async () => {
    const feed = new Hypercore(dbPath);
    const db = new Hyperbee(feed, {
        keyEncoding: 'utf-8',
        valueEncoding: 'binary'
    });
    await db.ready();

    let dhtSeed = (await db.get('dht-seed'))?.value;
    if (!dhtSeed) {
        dhtSeed = crypto.randomBytes(32);
        await db.put('dht-seed', dhtSeed);
    }

    const dht = new DHT({
        port: 50001,
        keyPair: DHT.keyPair(dhtSeed),
        bootstrap: [{ host: '127.0.0.1', port: 30001 }]
    });
    await dht.ready();

    return { dht, db, feed };
};

const getLatestPricesFromRPC = async (pairs) => {
    const { dht, db, feed } = await initDHTAndRPC();
    const rpc = new RPC({ dht });

    const serverPublicKey = Buffer.from('14e6cef3395904848fb10f2e6063a0bb6310789246fd1317baade4fd77319a62', 'hex');
    const payloadRaw = Buffer.from(JSON.stringify({ pairs }), 'utf-8');

    try {
        const responseRaw = await rpc.request(serverPublicKey, 'getLatestPrices', payloadRaw);
        const response = JSON.parse(responseRaw.toString('utf-8'));
        console.log('Latest Prices:', response);
    } catch (error) {
        console.error('Error fetching latest prices:', error);
    } finally {
        // Only destroy after the response handling
        await rpc.destroy();
        await dht.destroy();
        await db.close();
        await feed.close();
    }
};

const getHistoricalPricesFromRPC = async (pairs, from, to) => {
    const { dht, db, feed } = await initDHTAndRPC();
    const rpc = new RPC({ dht });

    const serverPublicKey = Buffer.from('14e6cef3395904848fb10f2e6063a0bb6310789246fd1317baade4fd77319a62', 'hex');
    const payloadRaw = Buffer.from(JSON.stringify({ pairs, from, to }), 'utf-8');

    try {
        const responseRaw = await rpc.request(serverPublicKey, 'getHistoricalPrices', payloadRaw);
        const response = JSON.parse(responseRaw.toString('utf-8'));
        console.log('Historical Prices:', response);
    } catch (error) {
        console.error('Error fetching historical prices:', error);
    } finally {
        // Only destroy after the response handling
        await rpc.destroy();
        await dht.destroy();
        await db.close();
        await feed.close();
    }
};

const main = async () => {
    const pairs = ['BTC', 'ETH', 'LTC'];
    await getLatestPricesFromRPC(pairs);

    const from = Date.now() - 86400000;
    const to = Date.now();
    await getHistoricalPricesFromRPC(['BTC', 'ETH'], from, to);
};

main().catch(console.error);
