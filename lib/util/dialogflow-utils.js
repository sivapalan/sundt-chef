'use strict';

function buildResponse(slackResponse) {
    return {
        'data': {
            'slack': slackResponse
        }
    };
}

module.exports = {
    buildResponse: buildResponse
};
