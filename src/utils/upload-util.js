const fs = require('fs');
const aws = require('aws-sdk');
const { AWS_ID, AWS_SECRET, AWS_BUCKET } = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

function uploadFile(path, filename, mimetype) {
  const contents = fs.readFileSync(path);
  const params = {
    Bucket: AWS_BUCKET,
    Key: filename,
    Body: contents,
    ContentType: mimetype,
  };

  const uploadPromise = new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      fs.unlinkSync(path); // remove temp file on our server after s3 has received it
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

module.exports = {
  uploadFile,
};
