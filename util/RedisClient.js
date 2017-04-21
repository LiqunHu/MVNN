const bluebird = require("bluebird");
const config = require('../config');
const redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(config.redis.port, config.redis.host, config.redis.opts);

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 * @param callback 回调函数
 */
exports.setItem = async(key, value, expired) => {
    try {
        await client.setAsync(key, JSON.stringify(value));
        if (expired) {
            client.expireAsync(key, expired);
        }
        return null;
    } catch (error) {
        console.log(error);
        return error;
    }
};

/**
 * 获取缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.getItem = async(key) => {
    try {
        let value = await client.getAsync(key);
        return JSON.parse(value);
    } catch (error) {
        console.log(error);
        return null;
    }

};

/**
 * 移除缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.removeItem = async(key, callback) => {
    try {
        await client.delAsync(key);
    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.tokenExpired = parseInt(config.TOKEN_AGE / 1000);
