'use strict';

var kue   = require('kue'),
    queue = kue.createQueue();

module.exports.create = function (attributes, callback) {
  var job = queue.create('simple-queue', {
    title: 'Simple Queue Title',
    attributes: attributes
  })
    .on('complete', function (result) {
      callback(null, result);
    })
    .on('failed', function (result) {
      callback(new Error('Queue Job is failed, status: ' + result.status));
    });

  job.save(function (err) {
    if (err) {
      return callback(err);
    }
  });
};

