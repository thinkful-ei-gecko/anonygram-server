const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../utils/upload-util');
const imagesRouter = express.Router();
const ImagesService = require('./images-service');

const UPLOAD_PATH = 'uploads/';
const upload = multer({ dest: `${UPLOAD_PATH}` });

imagesRouter.route('/').post(upload.single('someImage'), async (req, res, next) => {
  try {
    console.log(req.file);
    const { path, filename, mimetype } = req.file;
    const image_url = await uploadFile(path, filename, mimetype);
    const newSubmission = await ImagesService.createSubmission(req.app.get('db'), {
      image_url,
      karma_total: 0,
      latitude: '',
      longitude: '',
    });

    return res.status(201).json(newSubmission);
  } catch (error) {
    next(error);
  }
});

module.exports = imagesRouter;
