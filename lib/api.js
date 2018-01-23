'use strict';

const sundtChef = require('./sundt-chef');

function getMenuForDay(request, response) {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    let dayParam = request.query.day;
    let day = (dayParam >= 0 && dayParam < 7) ? dayParam : new Date().getDay();

    sundtChef.getMenuForDay(day)
        .then(menu => response.json(menu))
        .catch((reason) => {
            console.warn('Failed to fetch menu for requested day:', reason);
            response.status(503).json('Sorry, the menu for the requested day is currently not available.');
        });
}

function getMenusForWeek(request, response) {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    sundtChef.getMenusForWeek()
        .then(menus => response.json(menus))
        .catch((reason) => {
            console.warn('Failed to fetch menu:', reason);
            response.status(503).json('Sorry, the menu is currently not available.');
        });
}

exports.getMenuForDay = getMenuForDay;
exports.getMenusForWeek = getMenusForWeek;
