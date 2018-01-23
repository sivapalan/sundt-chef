'use strict';

const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env')
});

const sundtChef = require('../core/sundt-chef');

let dayArg = process.argv.slice(2)[0];
let day = (dayArg >= 0 && dayArg < 7) ? dayArg : new Date().getDay();

sundtChef.getCachedMenuForDay(day)
    .catch(() => sundtChef.getMenuForDay(day))
    .then(menu => console.log(menu))
    .catch(reason => console.warn('Failed to fetch menu for requested day:', reason));
