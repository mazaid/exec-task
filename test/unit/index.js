var assert = require('chai').assert;

var uuid = require('uuid');
var ExecTask = require(__dirname + '/../../index');

describe('ExecTask', function() {

    it('should create without errors', function(done) {
        var task = new ExecTask();
        done();
    });

    describe('#validate', function() {

        it('should validate success', function(done) {
            var raw = {
                id: uuid.v4(),
                checkTaskId: uuid.v4(),
                type: 'exec',
                data: {
                    command: 'ping -c 1 localhost'
                }
            };

            var task = new ExecTask(raw);

            task.validate()
                .then((validTask) => {
                    assert.deepEqual(validTask, task);
                    assert.equal(task.isValid(), true);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it('should error on empty raw data', function(done) {
            var raw = {};

            var task = new ExecTask(raw);

            task.validate()
                .then(() => {
                    done(new Error('not here'));
                })
                .catch((error) => {

                    error.checkChain(e => done(new Error('not here')))
                        .ifCode(error.ErrorCodes.INVALID_DATA, function(error) {
                            done();
                        })
                        .check();

                });
        });

        it('should error on invalid raw data', function(done) {
            var raw = {
                id: 'asdsa',
                checkTaskId: 'asd',
                type: 'sadas'
            };

            var task = new ExecTask(raw);

            task.validate()
                .then(() => {
                    done(new Error('not here'));
                })
                .catch((error) => {

                    assert.equal(error.ErrorCodes.INVALID_DATA, error.code);

                    done();

                });
        });

        describe('#serialize', function() {

            it('should success', function(done) {
                var raw = {
                    id: uuid.v4(),
                    checkTaskId: uuid.v4(),
                    type: 'exec',
                    data: {
                        command: 'ping -c 1 localhost'
                    }
                };

                var task = new ExecTask(raw);

                task.serialize()
                    .then((serialized) => {
                        assert.equal(JSON.stringify(raw), serialized);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });

            it('should error on empty data (null)', function(done) {
                var task = new ExecTask();

                task._task = null;

                task.serialize()
                    .then((serialized) => {
                        done(new Error('not here'));
                    })
                    .catch((error) => {
                        assert.equal(error.ErrorCodes.NO_DATA, error.code);
                        done();
                    });
            });

            it('should error on empty data ({})', function(done) {
                var task = new ExecTask();

                task._task = {};

                task.serialize()
                    .then((serialized) => {
                        done(new Error('not here'));
                    })
                    .catch((error) => {
                        assert.equal(error.ErrorCodes.NO_DATA, error.code);
                        done();
                    });
            });

        });


        describe('#deserialize', function() {

            it('should success', function(done) {
                var raw = {
                    id: uuid.v4(),
                    checkTaskId: uuid.v4(),
                    type: 'exec',
                    data: {
                        command: 'ping -c 1 localhost'
                    }
                };

                var task = new ExecTask(raw);

                var newTask = new ExecTask();

                task.serialize()
                    .then((serialized) => {
                        return newTask.deserialize(serialized);
                    })
                    .then(() => {
                        assert.deepEqual(task.data, newTask.data);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });

            it('should error on invalid serialized data, empty data', function(done) {
                var task = new ExecTask();

                task.deserialize('')
                    .then(() => {
                        done(new Error('not here'));
                    })
                    .catch((error) => {
                        assert.equal(error.ErrorCodes.NO_DATA, error.code);
                        done();
                    });

            });

            it('should error on invalid serialized data, not JSON', function(done) {
                var task = new ExecTask();

                task.deserialize('abcdefg')
                    .then(() => {
                        done(new Error('not here'));
                    })
                    .catch((error) => {

                        assert.equal(error.ErrorCodes.INVALID_DATA, error.code);
                        assert.equal('invalid serialized data', error.message);

                        done();
                    });

            });


            it('should error on invalid serialized data, invalid JSON data', function(done) {
                var task = new ExecTask();

                task.deserialize('{"id": "abcde"}')
                    .then(() => {
                        done(new Error('not here'));
                    })
                    .catch((error) => {

                        assert.equal(error.checkable, true);
                        assert.equal(error.ErrorCodes.INVALID_DATA, error.code);

                        done();
                    });

            });

        });

        describe('setter/getters', function () {

            it('#id', function () {
                var task = new ExecTask();

                var id = '123';

                task.id = id;

                assert.equal(task.id, id);

                var data = task.toObject();

                assert.equal(data.id, id);
            });

            it('#data', function () {
                var task = new ExecTask();

                var value = {command: 'ping'};

                task.data = value;

                assert.deepEqual(task.data, value);

                var data = task.toObject();

                assert.deepEqual(data.data, value);
            });

            it('#result', function () {
                var task = new ExecTask();

                var value = {command: 'ping'};

                task.result = value;

                assert.deepEqual(task.result, value);

                var data = task.toObject();

                assert.deepEqual(data.result, value);
            });

            it('#checkTaskId', function () {
                var task = new ExecTask();

                var value = 'asdasdas';

                task.checkTaskId = value;

                assert.deepEqual(task.checkTaskId, value);

                var data = task.toObject();

                assert.deepEqual(data.checkTaskId, value);
            });

            it('#type', function () {
                var task = new ExecTask();

                var value = 'exec';

                task.type = value;

                assert.deepEqual(task.type, value);

                var data = task.toObject();

                assert.deepEqual(data.type, value);
            });


        });

        describe('helper methods', function () {

            it('created', function (done) {

                var time = (new Date()).getTime() / 1000;

                var task = new ExecTask();

                task.created();

                assert.equal(Math.round(time), Math.round(task._task.creationDate));

                done();

            });

            it('started', function (done) {

                var time = (new Date()).getTime() / 1000;

                var task = new ExecTask();

                task.started();

                assert.equal(Math.round(time), Math.round(task._task.startDate));

                done();

            });


            it('finished', function (done) {

                var time = (new Date()).getTime() / 1000;

                var task = new ExecTask();

                task.finished();

                assert.equal(Math.round(time), Math.round(task._task.finishDate));

                done();

            });

        });

    });

});
