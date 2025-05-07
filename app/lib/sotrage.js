const multer = require('multer');

exports.storageProfile = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './static/upload/profilePic');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
