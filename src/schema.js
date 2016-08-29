var joi = require('joi');

module.exports = {
    id: joi.string().guid().required(),
    checkTaskId: joi.string().guid().required(),
    type: joi.string().valid(['exec', 'http']).required(),
    data: joi.object().unknown(true).required(),
    result: joi.object().unknown(true),
    creationDate: joi.date().timestamp('unix'),
    startDate: joi.date().timestamp('unix'),
    finishDate: joi.date().timestamp('unix')
};
