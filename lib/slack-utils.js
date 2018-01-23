'use strict';

const DAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

function createSlackMessageForMenu(menu, date) {
    return {
        'text': getTitle(date),
        'attachments': [{
            'fields': menu.map(item => ({
                'title': item.name,
                'value': item.price,
                'short': true
            }))
        }]
    };
}

function getTitle(date) {
    return isToday(date) ? 'Dagens meny' : 'Meny for ' + DAYS[date.getDay()];
}

function isToday(date) {
    return date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
}

function createSlackMessageForText(text, color) {
    return {
        'attachments': [
            {
                'text': text,
                'color': color
            }
        ]
    };
}

module.exports = {
    createSlackMessageForMenu: createSlackMessageForMenu,
    createSlackMessageForText: createSlackMessageForText
};
