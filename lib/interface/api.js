'use strict';

const sundtChef = require('../core/sundt-chef');

function getMenuForDay(request, response) {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    let dayParam = request.query.day;
    let day = (dayParam >= 0 && dayParam < 7) ? dayParam : new Date().getDay();

    sundtChef.getCachedMenuForDay(day)
        .catch(() => sundtChef.getMenuForDay(day))
        .then(menu => response.json(menu))
        .catch((reason) => {
            console.warn('Failed to fetch menu for requested day:', reason);
            response.status(503).json('Sorry, the menu for the requested day is currently not available.');
        });
}

function getMenusForWeek(request, response) {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    sundtChef.getCachedMenusForWeek()
        .catch(() => sundtChef.getMenusForWeek())
        .then(menus => response.json(menus))
        .catch((reason) => {
            console.warn('Failed to fetch menu:', reason);
            response.status(503).json('Sorry, the menu is currently not available.');
        });
}

function updateMenusCache(request, response) {
    console.log('Request headers: ' + JSON.stringify(request.headers));

    sundtChef.updateMenusCache()
        .then((menu) => {
            console.log('Updated menus cache:', menu);
            response.status(204).end();
        })
        .catch((reason) => {
            console.warn('Failed to update menus cache:', reason);
            response.status(503).json('Failed to update menus cache');
        });
}

exports.getMenuForDay = getMenuForDay;
exports.getMenusForWeek = getMenusForWeek;
exports.updateMenusCache = updateMenusCache;
