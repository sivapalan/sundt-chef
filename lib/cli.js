'use strict';

const sundtChef = require('./sundt-chef');

let dayArg = process.argv.slice(2)[0];
let day = (dayArg >= 0 && dayArg < 7) ? dayArg : new Date().getDay();

sundtChef.getMenuForDay(day)
    .then(menu => console.log(menu))
    .catch(reason => console.warn('Failed to fetch menu for requested day:', reason));
