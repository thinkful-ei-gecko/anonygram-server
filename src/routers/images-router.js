const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { uploadFile } = require('../utils/upload-util');
const imagesRouter = express.Router();

const UPLOAD_PATH = 'uploads/';
const upload = multer({ dest: `${UPLOAD_PATH}` });

imagesRouter.route('/').post(upload.single('someImage'), async (req, res, next) => {
  try {
    console.log(req.file);
    const { path, filename, mimetype } = req.file;
    const imageURL = await uploadFile(path, filename, mimetype);
    fs.unlinkSync(path); // remove temp file
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = imagesRouter;
