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
  s3.upload(params, (error, data) => {
    if (error) {
      throw error;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    return data.Location;
  });
}

module.exports = {
  uploadFile,
};
