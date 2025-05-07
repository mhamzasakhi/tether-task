const axios = require('axios');
const { COINGECKO_BASE_URL } = require('../../helpers/constants');

const fetchTop5Coins = async () => {
    // const url = `${COINGECKO_BASE_URL}/coins/markets`;
    // const params = {
    //     vs_currency: 'usdt',
    //     order: 'market_cap_desc',
    //     per_page: 5,
    //     page: 1,
    //     sparkline: false
    // };

    // const response = await axios.get(url, { params });

    // return response.data.map(coin => ({
    //     id: coin.id,
    //     symbol: coin.symbol,
    //     name: coin.name
    // }));

    try {
        const url = `${COINGECKO_BASE_URL}/coins/markets`;
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 5,
            page: 1,
            sparkline: false
        };
        const response = await axios.get(url, { params });

        // Check if response is valid and log the result
        if (response.status === 200) {
            console.log('Fetched data:', response.data);
            return response.data;
        } else {
            throw new Error(`API request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching price data:', error.message);
        if (error.response) {
          console.error('API response data:', error.response.data);
        }
        return [];
    }
};

const fetchPricesForCoin = async (coinId) => {
    const url = `${COINGECKO_BASE_URL}/coins/${coinId}/tickers`;
    const response = await axios.get(url);
    const tickers = response.data.tickers;

    // Filter tickers for USDT and sort by volume descending
    const usdtTickers = tickers
        .filter(ticker => ticker.target === 'USDT' && ticker.converted_last.usdt)
        .sort((a, b) => (b.volume - a.volume))
        .slice(0, 3); // Top 3 exchanges

    if (usdtTickers.length === 0) return null;

    const prices = usdtTickers.map(t => t.converted_last.usdt);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return {
        coinId,
        averagePrice: Number(averagePrice.toFixed(6)),
        timestamp: Date.now(),
        exchanges: usdtTickers.map(t => t.market.name)
    };
};

const fetchAllPrices = async () => {
    try {
        const coins = await fetchTop5Coins();
        const priceData = await Promise.all(
            coins.map(async (coin) => {
                const data = await fetchPricesForCoin(coin.id);
                if (data) {
                    return {
                        symbol: coin.symbol.toUpperCase(),
                        name: coin.name,
                        ...data
                    };
                }
                return null;
            })
        );

        return priceData.filter(Boolean);
    } catch (err) {
        console.error('Error fetching price data:', err.message);
        return [];
    }
};

module.exports = {
    fetchAllPrices
};
