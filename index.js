'use strict';

const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw dotenv.error;
}

const api = require('./lib/interface/api');
const dialogflow = require('./lib/interface/dialogflow');

exports.getMenuForDay = api.getMenuForDay;
exports.getMenusForWeek = api.getMenusForWeek;
exports.updateMenusCache = api.updateMenusCache;
exports.dialogflowChefFulfillment = dialogflow.dialogflowChefFulfillment;
