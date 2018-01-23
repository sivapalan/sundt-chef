'use strict';

const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw dotenv.error;
}

const api = require('./lib/api');
const dialogflow = require('./lib/dialogflow');

exports.getMenuForDay = api.getMenuForDay;
exports.getMenusForWeek = api.getMenusForWeek;
exports.dialogflowChefFulfillment = dialogflow.dialogflowChefFulfillment;
