'use strict';

const memjs = require('memjs');

const MEMCACHED_BUCKET_ENDPOINT = process.env.MEMCACHED_BUCKET_ENDPOINT;

function createClient() {
    return memjs.Client.create(MEMCACHED_BUCKET_ENDPOINT);
}

function put(key, value) {
    return new Promise((resolve, reject) => {
        let mc = createClient();
        let options = {
            expires: 24 * 60 * 60
        };
        return mc.set(key, value, options)
            .then(() => resolve())
            .catch(reason => reject(reason))
            .then(() => mc.quit());
    });
}

function get(key) {
    return new Promise((resolve, reject) => {
        let mc = createClient();
        mc.get(key)
            .then((success) => {
                if (success.value) {
                    resolve(success.value.toString());
                } else {
                    reject('Value with key \'' + key + '\' was not found in memcache');
                }
            })
            .catch(reason => reject(reason))
            .then(() => mc.quit());
    });
}

module.exports = {
    get: get,
    put: put
};
