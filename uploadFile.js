'use strict';

var gcloud = require('gcloud');


module.exports = function(gcloudConfig, cloudStorageBucket) {

  var storage = gcloud.storage(gcloudConfig);
  var bucket = storage.bucket(cloudStorageBucket);

  function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + cloudStorageBucket +'/' + filename;
  }
  
  function sendUploadToGCS(req, res, next) {
    var gcsname = Date.now();
    var file = bucket.file(gcsname);
    var stream = file.createWriteStream();

    stream.on('error', function(err) {
      req.file.cloudStorageError = err;
      console.log(err);
    });

    stream.on('finish', function() {
      req.file.cloudStorageObject = gcsname;
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    });
    stream.end(req.file.buffer);
    res.end();
    next();

  }
  
  var multer = require('multer')({
    inMemory: true,
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
    rename: function(fieldname, filename) {
      // generate a unique filename
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    }
  });
  // [END multer]


  return {
    getPublicUrl: getPublicUrl,
    sendUploadToGCS: sendUploadToGCS,
    multer: multer
  };
};
