'use strict';

var ErrorCodes = {
    NO_DATA: 'noData',
    INVALID_DATA: 'invalidData'
};

var Statuses = {
    CREATED: 'created',
    QUEUED: 'queued',
    STARTED: 'started',
    FINISHED: 'finished'
};

var error = require('mazaid-error/create')(ErrorCodes);

var validate = require('./validate');

var entityName = 'execTask';

/**
 * @class
 */
class ExecTask {

    /**
     * @constructor
     * @param  {Object} rawTask
     */
    constructor(rawTask) {

        this.Statuses = Statuses;

        this.ErrorCodes = ErrorCodes;

        this._valid = false;

        this._task = {
            id: null,
            checkTaskId: null,
            type: null,
            timeout: 60,
            data: {},
            status: null,
            result: null,
            creationDate: null,
            startDate: null,
            finishDate: null
        };

        if (rawTask) {
            this._task = rawTask;
            this.created();
        }

    }

    /**
     * id getter
     *
     * @return {String}
     */
    get id() {
        return this._task.id;
    }

    /**
     * id setter
     *
     * @param  {String} value
     */
    set id(value) {
        this._task.id = value;
    }

    /**
     * checkTaskId getter
     *
     * @return {String}
     */
    get checkTaskId() {
        return this._task.checkTaskId;
    }

    /**
     * checkTaskId setter
     *
     * @param  {String} value
     */
    set checkTaskId(value) {
        this._task.checkTaskId = value;
    }

    /**
     * timeout getter
     *
     * @return {String}
     */
    get timeout() {
        return this._task.timeout;
    }

    /**
     * timeout setter
     *
     * @param  {String} value
     */
    set timeout(value) {
        this._task.timeout = value;
    }

    /**
     * type getter
     *
     * @return {String}
     */
    get type() {
        return this._task.type;
    }

    /**
     * type setter
     *
     * @param  {String} value
     */
    set type(value) {
        this._task.type = value;
    }

    /**
     * data getter
     *
     * @return {Object}
     */
    get data() {
        return this._task.data;
    }

    /**
     * data setter
     *
     * @param  {Object} value
     */
    set data(value) {
        this._task.data = value;
    }

    /**
     * status getter
     *
     * @return {String}
     */
    get status() {
        return this._task.status;
    }

    /**
     * result getter
     *
     * @return {Object}
     */
    get result() {
        return this._task.result;
    }

    /**
     * result setter
     *
     * @param  {Object} value
     */
    set result(value) {
        this._task.result = value;
    }

    /**
     * set creationDate
     */
    created() {
        this._task.status = Statuses.CREATED;
        this._task.creationDate = this._time(true);
    }

    /**
     * set queuedDate and status
     *
     * TODO tests
     */
    queued() {
        this._task.status = Statuses.QUEUED;
        this._task.queuedDate = this._time(true);
    }

    /**
     * set startDate
     */
    started() {
        this._task.status = Statuses.STARTED;
        this._task.startDate = this._time(true);
    }

    /**
     * set finishDate
     */
    finished() {
        this._task.status = Statuses.FINISHED;
        this._task.finishDate = this._time(true);
    }

    /**
     * is valid
     *
     * @return {Boolean}
     */
    isValid() {
        return this._valid;
    }

    /**
     * validate task data
     *
     * @return {Promise}
     */
    validate() {

        return new Promise((resolve, reject) => {
            validate(this._task)
                .then((validData) => {
                    this._valid = true;
                    this._task = validData;
                    resolve(this);
                })
                .catch((error) => {
                    if (error.name === 'ValidationError') {
                        reject(
                            this._error(
                                'invalid data',
                                ErrorCodes.INVALID_DATA
                            )
                            .setList(error.details)
                        );
                    } else {
                        reject(error);
                    }
                });
        });

    }

    /**
     * serialize task
     *
     * @return {Promise}
     */
    serialize() {

        return new Promise((resolve, reject) => {
            if (!this._task || Object.keys(this._task).length === 0) {
                return reject(this._error('no data', ErrorCodes.NO_DATA));
            }

            this.validate()
                .then(() => {
                    resolve(JSON.stringify(this._task));
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

    /**
     * deserialize task data
     *
     * @param  {String} raw
     * @return {Promise}
     */
    deserialize(raw) {

        return new Promise((resolve, reject) => {

            if (!raw) {
                return reject(this._error('empty serialized data', ErrorCodes.NO_DATA));
            }

            try {
                var parsed = JSON.parse(raw);
            } catch (e) {
                return reject(this._error('invalid serialized data', ErrorCodes.INVALID_DATA));
            }

            if (
                typeof parsed !== 'object' ||
                Object.keys(parsed).length === 0
            ) {
                return reject(this._error('invalid serialized data', ErrorCodes.INVALID_DATA));
            }

            this._task = parsed;

            this.validate()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

    /**
     * get task as object
     *
     * @return {Object}
     */
    toObject() {
        return JSON.parse(JSON.stringify(this._task));
    }

    /**
     * erro helper
     *
     * @param  {String} message
     * @param  {String} code
     * @return {Error}
     */
    _error(message, code) {
        return error(message, code, entityName);
    }

    /**
     * get timestamp
     *
     * @param {Boolean} round
     * @return {Number}
     */
    _time(round) {
        var ts = (new Date()).getTime() / 1000;

        if (round) {
            ts = Math.round(ts);
        }

        return ts;
    }

}

module.exports = ExecTask;
