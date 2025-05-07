const path = require('path'),
	fs = require('fs'),
	fsP = fs.promises,
	crypto = require('crypto'),
	aws = require('aws-sdk');
const { parse } = require('csv-parse');
//const {uploadsDir, uploadsRelPath} = require('./pathHelper');

const s3 = new aws.S3({
	accessKeyId: process.env.AWS_KEY_ID,
	secretAccessKey: process.env.AWS_SEECRET,
});

exports.createFolder = async (path) => {
	if (!fs.existsSync(path)) {
		return fsP.mkdir(path, { recursive: true });
	}
};

exports.uploadFile = (file, folder, elementId = '') => {
	const ext = path.extname(file.name);
	const fileName =
		crypto
			.createHash('md5')
			.update(new Date().getTime() + file.name)
			.digest('hex') + ext;
	//const filePath = path.join(folder, elementId.toString());
	const params = {
		Bucket: process.env.AWS_BUCKET,
		Key: `${folder}/${elementId}/${fileName}`,
		ContentType: file.mimetype,
		Body: file.data,
		Metadata: {
			'Content-Type': file.mimetype,
		},
	};
	
	return new Promise((resolve, reject) => {
		s3.upload(params, function (err, data) {
			if (err) {
				reject(err);
			}
			if (process.env.CLOUDFRONT_DOMAIN) {
				resolve(`https://${process.env.CLOUDFRONT_DOMAIN}/${data.Key}`);
			}
			resolve(data.Location);
		});
	});
};
exports.removeFile = (fileUrl) => {
	try {
		let key = getFileKeyFromUrl(fileUrl);
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: key,
		};
		return new Promise((resolve, reject) => {
			s3.deleteObject(params, function (err, data) {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	} catch (err) {
		return false;
	}
};

exports.getFileByUrl = (fileUrl) => {
	try {
		let key = getFileKeyFromUrl(fileUrl);
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: key,
		};
		return new Promise((resolve, reject) => {
			s3.getObject(params, function (error, data) {
				if (error != null) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});
	} catch (err) {
		return false;
	}
};

exports.getRXOrderPrescription = (fileUrl) => {
	try {
		const rxS3 = new aws.S3({
			accessKeyId: process.env.RX_ACCESS_KEY_ID,
			secretAccessKey: process.env.RX_SECRET,
			// region: process.env.RX_DEFAULT_REGION,
		});
		const key = getFileKeyFromUrl(fileUrl);
		const params = {
			Bucket: process.env.RX_AWS_BUCKET,
			Key: key,
		};
		return new Promise((resolve, reject) => {
			rxS3.getObject(params, function (error, data) {
				if (error != null) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});
	} catch (err) {
		return false;
	}
};

getFileKeyFromUrl = (url) => {
	return new URL(url).pathname.substring(1);
};