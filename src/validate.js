var joi = require('joi');

var schema = {
    id: joi.string().guid().required(),
    checkTaskId: joi.string().guid().required(),
    type: joi.string().valid(['exec', 'http']).required(),
    data: joi.object().unknown(true).required(),
    result: joi.object().unknown(true),
    creationDate: joi.date().timestamp('unix'),
    startDate: joi.date().timestamp('unix'),
    finishDate: joi.date().timestamp('unix')
};

var joiOptions = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

module.exports = function (rawData) {

    return new Promise((resolve, reject) => {

        joi.validate(rawData, schema, joiOptions, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });

    });

};
