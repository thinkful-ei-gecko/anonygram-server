const express = require('express');
const multer = require('multer');
const UploadService = require('../services/upload-service');
const imagesRouter = express.Router();

const UPLOAD_PATH = 'uploads/';
const upload = multer({ dest: `${UPLOAD_PATH}` });

imagesRouter
  .route('/')
  .post(upload.single('someImage'), async (req, res, next) => {
    try {
      console.log(req.file);
      const { path, filename, mimetype } = req.file;
      await UploadService.uploadFile(path, filename, mimetype);
      return res.redirect('/');
    } catch (error) {
      next(error);
    }
  });

module.exports = imagesRouter;
