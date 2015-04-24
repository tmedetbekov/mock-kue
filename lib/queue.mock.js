'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits     = require('util').inherits;

function KueMock() {}

inherits(KueMock, EventEmitter);

KueMock.prototype.save = function (callback) {
  process.nextTick(function () {
    callback();
  });
};

module.exports = KueMock;
