var NodeCache = require('node-cache');
const ServerError = require('../errors/ServerError');

const defaultOptions = {
	useClones: false,
	stdTTL: 60,
};

module.exports = function (options = defaultOptions) {
	options = Object.assign({}, defaultOptions, options);
	let cache = new NodeCache(options);
	cache.delete = cache.del.bind(cache);
	cache.clear = cache.flushAll.bind(cache);
	//TODO cache
	/*cache.getOrSet = function(key, func) {
        return cache.pget(key).then(function(result) {
            if (result) {
                return result;
            }
            return func().then(function(result) {
                return cache.pset(key, result);
            });
        })
    };*/
	return cache;
};
