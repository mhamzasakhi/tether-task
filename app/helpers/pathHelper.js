const path = require('path');

exports.rootDir = path.dirname(process.mainModule.filename);

exports.uploadsDir = path.join(path.dirname(process.mainModule.filename), 'static', 'upload');

exports.uploadsRelPath = '/static/upload/';

exports.staticRelPath = '/static/upload/';

exports.mailDir = path.join(path.dirname(process.mainModule.filename), 'static', 'emails');
