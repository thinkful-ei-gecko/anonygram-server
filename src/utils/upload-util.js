const fs = require('fs');
const aws = require('aws-sdk');
const { AWS_ID, AWS_SECRET, AWS_BUCKET } = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

function uploadFile(fileContents, filePath, fileName, mimeType) {
  if (!AWS_ID || !AWS_SECRET || !AWS_BUCKET) {
    fs.unlinkSync(filePath); // remove uploaded file from server
    throw { message: 'AWS credentials not configured' };
  }

  // const contents = fs.readFileSync(path);
  const params = {
    Bucket: AWS_BUCKET,
    Key: fileName,
    Body: fileContents,
    ContentType: mimeType,
  };

  const uploadPromise = new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      fs.unlinkSync(filePath); // remove temp file on our server after s3 has received it
      if (error) {
        reject(error);
      }
      resolve(data.Location);
    });
  });

  return uploadPromise
    .then((dataLocation) => {
      console.log(`File uploaded successfully. ${dataLocation}`);
      return dataLocation;
    })
    .catch((error) => {
      throw error;
    });
}

function imageFilter(req, file, callback) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback({ status: 415, message: 'File type is not an image' }, false);
  }
  callback(null, true);
}

module.exports = {
  uploadFile,
  imageFilter,
};
