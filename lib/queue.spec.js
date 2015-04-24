"use strict";

var should = require('should'),
    sinon  = require('sinon');

var kue  = require('kue'),
    jobs = kue.createQueue();

var KueMock = require('./queue.mock');

var queue = require('./queue');

describe('Library: simple-queue', function () {
  var queueStub;

  // stub `queue#create`
  beforeEach(function () {
    queueStub = null;

    sinon.stub(jobs, 'create', function () {
      var queueMock = new KueMock();

      process.nextTick(function () {
        queueStub ? queueStub.call(queueMock) : '';
      });

      return queueMock;
    });
  });

  // restore `queue#create` stub
  afterEach(function () {
    jobs.create.restore();
  });

  describe('when queue job is successfully completed', function () {
    // trigger queue#complete event
    beforeEach(function () {
      queueStub = function () {
        var self = this;

        process.nextTick(function () {
          self.emit('complete', { status: 'success' });
        });
      };
    });

    it('creates a queue job', function (done) {
      queue.create({}, function (err) {
        if (err) {
          return done(err);
        }

        if (!jobs.create.called) {
          return done(new Error('expected the `jobs.create` to be called'))
        }

        done();
      });
    });

    it('completes a queue job with `success` status', function (done) {
      queue.create({}, function (err, result) {
        if (err) {
          console.log(err);
          return done(err);
        }

        result.should.have.properties({
          status: 'success'
        });

        done();
      });
    });
  });

  describe('when queue job is failed', function () {
    // trigger queue#complete event
    beforeEach(function () {
      queueStub = function () {
        var self = this;

        process.nextTick(function () {
          self.emit('failed', { status: 'failed' });
        });
      };
    });

    it('completes a queue job with `failed` status', function (done) {
      queue.create({}, function (err) {
        if (!err) {
          return done(new Error('expected an error to exist'));
        }

        err.should.have.property('message', 'Queue Job is failed, status: failed');

        done();
      });
    });
  });
});
