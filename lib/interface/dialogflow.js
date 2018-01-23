'use strict';

const sundtChef = require('../core/sundt-chef');
const dialogflowUtils = require('../util/dialogflow-utils');
const slackUtils = require('../util/slack-utils');

const MENU_FOR_DAY_ACTION = 'menuForDay';

function dialogflowChefFulfillment(request, response) {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    if (request.body.result) {
        processV1Request(request, response);
    } else {
        console.warn('Invalid Request');
        response.status(400).end('Invalid Webhook Request (expecting v1 webhook request)');
    }
}

function processV1Request(request, response) {
    let action = request.body.result.action;
    console.log('Action: ' + action);
    if (action == MENU_FOR_DAY_ACTION) {
        let date = new Date(request.body.result.parameters.date);
        let day = date.getDay();

        console.log('Requesting menu for date: ' + date.toDateString());

        if (day == 0 || day == 6) {
            let slackMsg = slackUtils.createSlackMessageForText('Sorry, the menu for the requested day is not available.');
            return response.json(dialogflowUtils.buildResponse(slackMsg));
        }

        sundtChef.getCachedMenuForDay(day)
            .catch(() => sundtChef.getMenuForDay(day))
            .then((menu) => {
                console.log('Menu:', menu);
                let slackMsg = slackUtils.createSlackMessageForMenu(menu, date);
                response.json(dialogflowUtils.buildResponse(slackMsg));
            })
            .catch((reason) => {
                console.warn('Failed to fetch menu for requested day:', reason);
                let slackMsg = slackUtils.createSlackMessageForText('Sorry, the menu for the requested day is currently not available.');
                response.json(dialogflowUtils.buildResponse(slackMsg));
            });
    } else {
        response.end();
    }
}

exports.dialogflowChefFulfillment = dialogflowChefFulfillment;
