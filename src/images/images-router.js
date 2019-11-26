const express = require('express')
const multer = require('multer')
const { uploadFile } = require('../utils/upload-util')
const { getDistanceFromLatLonInKm } = require('../utils/location-util')
const imagesRouter = express.Router()
const ImagesService = require('./images-service')

const UPLOAD_PATH = 'uploads/'
const upload = multer({ dest: `${UPLOAD_PATH}` })

imagesRouter
  .use(express.json())
  .route('/')
  .get(async (req, res, next) => {
    const { sort, lat, lon } = req.body

    if (sort !== 'top' && sort !== 'new') {
      return res
        .status(400)
        .json({ error: 'Invalid value provided for sort param' })
    }

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: 'lat and lon parameters are required' })
    }

    try {
      // compare a current lat/lon center against all submissions in the database
      // return only those within a 20km radius

      const submissions = await ImagesService.getSubmissionsSorted(
        req.app.get('db'),
        sort
      )
      const submissionsByLocation = []
      // filter all submissions for their distance against the request lat/lon
      submissions.forEach(submission => {
        let distance = getDistanceFromLatLonInKm(
          lat,
          lon,
          submission['latitude'],
          submission['longitude']
        )

        // bundle all posts that are within ~20km of the req lat/long
        if (distance < 20) {
          return submissionsByLocation.push(submission)
        }
      })
      return res.status(200).json(submissionsByLocation)
    } catch (e) {
      next(e)
    }
  })
  .post(upload.single('someImage'), async (req, res, next) => {
    try {
      console.log(req.file)
      const { path, filename, mimetype } = req.file
      const image_url = await uploadFile(path, filename, mimetype)
      const newSubmission = await ImagesService.createSubmission(
        req.app.get('db'),
        {
          image_url,
          karma_total: 0,
          latitude: '',
          longitude: '',
        }
      )

      return res.status(201).json(newSubmission)
    } catch (error) {
      next(error)
    }
  })

module.exports = imagesRouter
