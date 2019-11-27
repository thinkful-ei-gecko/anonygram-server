require('dotenv').config()

async function quickstart() {
  
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  const UPLOAD_PATH = 'uploads/'

  // Creates a client
  const visionClient = new vision
    .ImageAnnotatorClient()

  // Performs label detection on the image file
  const [result] = await visionClient.labelDetection(`${UPLOAD_PATH}/lev.png`);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

quickstart()