'use strict';

const api = require('./lib/api');
const dialogflow = require('./lib/dialogflow');

exports.getMenuForDay = api.getMenuForDay;
exports.getMenusForWeek = api.getMenusForWeek;
exports.dialogflowChefFulfillment = dialogflow.dialogflowChefFulfillment;
