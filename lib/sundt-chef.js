'use strict';

const request = require('request');
const cheerio = require('cheerio');

const memcacheClient = require('./memcache-client');

const UKENS_MENY_URL = 'http://sundtkvartalet.eurest.no/ukens-meny/';
const DAYS = ['sondag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lordag'];

function extractMenuForDay(html, day) {
    let $ = cheerio.load(html);
    let dishItems = $('#' + DAYS[day] + ' > .dish-list > li');
    return dishItems.map(function(i, item) {
        let name = $(item).children('.dish-name').text();
        let price = $(item).children('.dish-price').text();
        let formattedPrice = price.trim().replace(/\s+/g, ' ').replace(/kr/g, 'kr ');
        return ({
            'name': name,
            'price': formattedPrice
        });
    }).get();
}

function fetchMenuHtmlPage() {
    return new Promise((resolve, reject) => {
        let t0 = new Date().getTime();
        request(UKENS_MENY_URL, function(error, response, html) {
            let t1 = new Date().getTime();
            console.log('Fetched HTML in ' + (t1 - t0) + ' ms.');
            if (error) {
                reject(error);
            } else if (response.statusCode !== 200) {
                reject('Unexpected status code: ' + response.statusCode);
            } else {
                resolve(html);
            }
        });
    });
}

function getMenuForDay(day) {
    return new Promise((resolve, reject) => {
        fetchMenuHtmlPage()
            .then((html) => {
                let menu = extractMenuForDay(html, day);
                if (isMenuValid(menu)) {
                    resolve(menu);
                } else {
                    reject('Menu is not valid.');
                }
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function getMenusForWeek() {
    return new Promise((resolve, reject) => {
        fetchMenuHtmlPage()
            .then((html) => {
                let menus = DAYS.map((value, i) => {
                    let menu = extractMenuForDay(html, i);
                    return isMenuValid(menu) ? menu : [];
                });
                menus.some(isMenuValid) ? resolve(menus) : reject('No valid menus found');
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function getMenusFromCache() {
    return new Promise((resolve, reject) => {
        let t0 = new Date().getTime();
        console.log('Execute request for getMenusFromCache');
        memcacheClient.get('menus')
            .then((value) => {
                let t1 = new Date().getTime();
                console.log('Fetched menus from memcache in ' + (t1 - t0) + ' ms.');
                let menus = JSON.parse(value);
                resolve(menus);
            })
            .catch((reason) => {
                console.warn('Failed to get menu from memcache. Reason:', reason);
                reject(reason);
            });
    });
}

function getCachedMenuForDay(day) {
    return new Promise((resolve, reject) => {
        return getMenusFromCache()
            .then((menus) => {
                let menu = menus[day];
                if (isMenuValid(menu)) {
                    resolve(menu);
                } else {
                    reject('Menu is not valid.');
                }
            })
            .catch(reason => reject(reason));
    });
}

function getCachedMenusForWeek() {
    return new Promise((resolve, reject) => {
        return getMenusFromCache()
            .then(menus => resolve(menus))
            .catch(reason => reject(reason));
    });
}

function updateMenusCache() {
    return new Promise((resolve, reject) => {
        getMenusForWeek()
            .then((menus) => {
                memcacheClient.put('menus', JSON.stringify(menus))
                    .then(() => resolve(menus))
                    .catch(reason => reject(reason));
            })
            .catch(reason => reject(reason));
    });
}

function isMenuValid(menu) {
    return menu != null && menu.length > 0 && menu.every(item =>
        (item.name && item.price && item.price.indexOf('kr ') >= 0));
}

module.exports = {
    getMenuForDay: getMenuForDay,
    getMenusForWeek: getMenusForWeek,
    getCachedMenuForDay: getCachedMenuForDay,
    getCachedMenusForWeek: getCachedMenusForWeek,
    updateMenusCache: updateMenusCache
};
