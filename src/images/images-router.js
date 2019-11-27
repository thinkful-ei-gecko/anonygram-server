const express = require('express');
const jsonParser = express.json();
const multer = require('multer');
const { uploadFile, imageFilter } = require('../utils/upload-util');
const { getDistanceFromLatLonInKm } = require('../utils/location-util');
const { checkNSFWLikely } = require('../utils/vision-util');
const imagesRouter = express.Router();
const ImagesService = require('./images-service');
const upload = multer({ dest: 'uploads/', fileFilter: imageFilter });

imagesRouter
  .route('/')
  .get(async (req, res, next) => {
    const { sort, lat, lon } = req.query;

    if (sort !== 'top' && sort !== 'new') {
      return res.status(400).json({ error: 'Invalid value provided for sort param' });
    }

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon parameters are required' });
    }

    try {
      // compare a current lat/lon center against all submissions in the database
      // return only those within a 20km radius

      const submissions = await ImagesService.getSubmissionsSorted(
        req.app.get('db'),
        sort
      );
      const submissionsByLocation = [];
      // filter all submissions for their distance against the request lat/lon
      submissions.forEach((submission) => {
        let distance = getDistanceFromLatLonInKm(
          lat,
          lon,
          submission['latitude'],
          submission['longitude']
        );

        // bundle all posts that are within ~20km of the req lat/long
        if (distance < 20) {
          return submissionsByLocation.push(submission);
        }
      });
      return res.status(200).json(submissionsByLocation);
    } catch (e) {
      next(e);
    }
  })
  .post(jsonParser, upload.single('someImage'), async (req, res, next) => {
    try {
      console.log(req.file);
      const { latitude, longitude } = req.body;
      const { path, filename, mimetype } = req.file;
      const isNSFW = await checkNSFWLikely(path)
      
      if (isNSFW) {
        return res.status(400).json({error: 'provided content does not meet community guidelines'})
      }

      const image_url = await uploadFile(path, filename, mimetype);
      const newSubmission = await ImagesService.createSubmission(req.app.get('db'), {
        image_url,
        latitude,
        longitude,
      });

      return res.status(201).json(newSubmission);
    } catch (error) {
      next(error);
    }
  });

imagesRouter
  .use(jsonParser)
  .route('/:submission_id')
  .all(async (req, res, next) => {
    const id = req.params.submission_id;
    const submission = await ImagesService.getSingleSubmission(req.app.get('db'), id);

    if (!submission) {
      return res.status(400).json({ error: 'id does not exist' });
    }

    res.submission = submission;
    next();
  })
  .patch(async (req, res, next) => {
    const { karma_total } = req.body;

    if (!karma_total) {
      return res.status(400).json({ error: 'karma_total is required' });
    }

    try {
      const submissionData = {
        ...res.submission,
        karma_total,
      };

      const updatedSubmission = await ImagesService.updateSingleSubmission(
        req.app.get('db'),
        res.submission.id,
        submissionData
      );
      return res.status(200).json(updatedSubmission);
    } catch (e) {
      next(e);
    }
  });

module.exports = imagesRouter;
