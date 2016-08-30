var joi = require('joi');

module.exports = {
    id: joi.string().guid().required(),
    checkTaskId: joi.string().guid().required(),
    type: joi.string().valid(['exec', 'http']).required(),
    timeout: joi.number().min(1).default(60).description('task execution timeout in seconds, default = 60'),
    data: joi.object().unknown(true).required(),
    status: joi.string().valid(['created', 'queued', 'started', 'finished']).required(),
    result: joi.object().unknown(true),
    creationDate: joi.number().integer().min(0).required(),
    queuedDate: joi.number().integer().min(0),
    startDate: joi.number().integer().min(0),
    finishDate: joi.number().integer().min(0)
};
