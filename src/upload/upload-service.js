const fs = require('fs');
const aws = require('aws-sdk');
const { AWS_ID, AWS_SECRET, AWS_BUCKET } = require('../config');

const s3 = new aws.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

const UploadService = {
  uploadImage(fileName) {
    const contents = fs.readFileSync(fileName);
    const params = {
      Bucket: AWS_BUCKET,
      Key: fileName,
      Body: contents,
      ContentType: 'image/jpeg',
    };
    s3.upload(params, (error, data) => {
      if (error) {
        throw error;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
  },
};

module.exports = UploadService;
