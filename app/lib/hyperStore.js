const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');
const path = require('path');
const ram = require('random-access-file');

const dbPath = path.join(__dirname, '../../.db/rpc-client');
const createFeed = (name) => {
  const feedName = name || 'default';
  try {
    const core = new Hypercore(feedName => {
      try {
        return ram(path.join(dbPath, feedName));
      } catch (ramError) {
        console.error("Error creating random-access-file:", ramError);
        throw ramError; // Wrap and rethrow
      }
    }, { valueEncoding: 'json' });
    return core;
  } catch (error) {
    console.error("Error creating Hypercore feed:", error);
    throw error; // Re-throw to be caught in initDB
  }
};

const initDB = async () => {
  try {
    const feed = createFeed();
    await feed.ready();
    const db = new Hyperbee(feed, {
      keyEncoding: 'utf-8',
      valueEncoding: 'json'
    });
    await db.ready();
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Save current prices
const storeLatestPrices = async (priceList) => {
  let db;
  try {
    db = await initDB();
    const batch = db.batch();

    for (const priceObj of priceList) {
      const key = `latest/${priceObj.symbol}`;
      await batch.put(key, priceObj);

      // Store historical too
      const timestamp = new Date(priceObj.timestamp).toISOString();
      const histKey = `history/${priceObj.symbol}/${timestamp}`;
      await batch.put(histKey, priceObj);
    }

    await batch.flush();
  } catch (error) {
    console.error("Error storing latest prices:", error);
    throw error; // Re-throw to caller
  } finally {
    if (db) {
      await db.close();
    }
  }
};

// Retrieve current prices
const getLatestPrices = async (symbols) => {
  let db;
  try {
    db = await initDB();
    const results = {};

    for (const symbol of symbols) {
      const entry = await db.get(`latest/${symbol.toUpperCase()}`);
      if (entry?.value) results[symbol] = entry.value;
    }
    return results;
  } catch (error) {
    console.error("Error in getLatestPrices:", error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
};

// Retrieve historical prices
const getHistoricalPrices = async (symbols, from, to) => {
  let db;
  try {
    db = await initDB();
    const results = {};
    for (const symbol of symbols) {
      results[symbol] = [];

      const prefix = `history/${symbol.toUpperCase()}/`;
      const iter = db.createReadStream({ gte: prefix, lte: prefix + '\xff' });

      for await (const { key, value } of iter) {
        const ts = new Date(value.timestamp).getTime();
        if (ts >= from && ts <= to) {
          results[symbol].push(value);
        }
      }
    }
    return results;
  } catch (error) {
    console.error("Error in getHistoricalPrices:", error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
};

module.exports = {
  storeLatestPrices,
  getLatestPrices,
  getHistoricalPrices
};
