"use strict";

var should = require('should'),
    sinon  = require('sinon');

var kue  = require('kue'),
    jobs = kue.createQueue();

var queue = require('./queue');

describe('Library: simple-queue', function () {
  it('creates a queue job');

  it('completes a queue job with `success` status');

  it('completes a queue job with `failed` status');
});
