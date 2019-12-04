const express = require('express')
const jsonParser = express.json()
const multer = require('multer')
const {
  uploadFile,
  removeFile,
  acceptImagesOnly,
} = require('../utils/file-util')
const { getDistanceFromLatLonInKm } = require('../utils/location-util')
const { checkNSFWLikely } = require('../utils/vision-util')
const {
  getDefaultPlaceData,
  getImageByReference,
} = require('../utils/places-util')
const imagesRouter = express.Router()
const ImagesService = require('./images-service')
const upload = multer({ dest: 'uploads/', fileFilter: acceptImagesOnly })
const sharp = require('sharp')

imagesRouter
  .route('/')
  .get(async (req, res, next) => {
    const { sort, lat, lon, page } = req.query

    if (sort !== 'top' && sort !== 'new') {
      return res
        .status(400)
        .json({ error: 'Invalid value provided for sort param' })
    }

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: 'lat and lon parameters are required' })
    } else if (!parseFloat(lat) || !parseFloat(lon)) {
      return res
        .status(400)
        .json({ error: 'lat and lon parameters are invalid' })
    }

    if (!!page && !parseInt(page)) {
      return res.status(400).json({ error: 'page parameter is invalid' })
    }

    try {
      // compare a current lat/lon center against all submissions in the database
      // return only those within a 20km radius

      const submissions = await ImagesService.getSubmissions(
        req.app.get('db'),
        sort,
        page || null
      )

      const submissionsByLocation = []
      // filter all submissions for their distance against the request lat/lon
      if (!!submissions.length) {
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
      }

      // if we do not have any data, we are using Google to make some
      // submissions that are nearby the requested lat/lon
      // also only do this when no data exists at all
      // pagination can technically otherwise cause it to seem like
      // no data artificially

      if (!submissionsByLocation.length && (!page || (!!page && parseInt(page) === 1))) {
        // make a request to get place coordinates and the photo_reference
        let defaultPlaces = await getDefaultPlaceData(lat, lon)
        await Promise.all(
          defaultPlaces.results.map(async location => {
            // if the location has a photos attribute, grab the reference and
            // make a separate request to retrieve the hosted image URL from
            // the reference ID
            if (location.photos) {
              let image_url = await getImageByReference(
                location.photos[0]['photo_reference']
              )
              const submission = {
                image_url,
                latitude: location.geometry.location.lat,
                longitude: location.geometry.location.lng,
              }

              // insert these new submissions into the database
              await ImagesService.createSubmission(
                req.app.get('db'),
                submission
              )
            }
          })
        )
        const googleSubmissions = await ImagesService.getSubmissions(
          req.app.get('db'),
          sort
        )

        // if somehow even Google has no nearby locations with images
        // send an error
        if (!googleSubmissions.length) {
          return res.status(400).json({ error: 'no submissions available' })
        }
        return res.status(200).json(googleSubmissions)
      }

      return res.status(200).json(submissionsByLocation)
    } catch (e) {
      next(e)
    }
  })
  .post(jsonParser, upload.single('someImage'), async (req, res, next) => {
    try {
      console.log(req.file)
      const { image_text, latitude, longitude } = req.body
      const { path, filename } = req.file
      const isNSFW = await checkNSFWLikely(path)

      if (isNSFW) {
        removeFile(path) // remove uploaded file from disk
        return res.status(400).json({
          error: 'provided content does not meet community guidelines',
        })
      }

      const imageData = await sharp(path)
        .rotate() // auto-rotate based on EXIF metadata
        .resize({ width: 1200, withoutEnlargement: true }) // limit max width
        .jpeg({ quality: 70 }) // compress to jpeg with indistinguishable quality difference
        .toBuffer() // returns a Promise<Buffer>

      const image_url = await uploadFile(
        imageData,
        path,
        filename,
        'image/jpeg'
      )
      const newSubmission = await ImagesService.createSubmission(
        req.app.get('db'),
        {
          image_url,
          image_text,
          latitude,
          longitude,
        }
      )

      return res.status(201).json(newSubmission)
    } catch (error) {
      next(error)
    }
  })

imagesRouter
  .use(jsonParser)
  .route('/:submission_id')
  .all(async (req, res, next) => {
    const id = req.params.submission_id
    const submission = await ImagesService.getSingleSubmission(
      req.app.get('db'),
      id
    )

    if (!submission) {
      return res.status(400).json({ error: 'id does not exist' })
    }

    res.submission = submission
    next()
  })
  .patch(async (req, res, next) => {
    const { karma_total } = req.body

    if (!karma_total) {
      return res.status(400).json({ error: 'karma_total is required' })
    }

    try {
      const submissionData = {
        ...res.submission,
        karma_total,
      }

      const updatedSubmission = await ImagesService.updateSingleSubmission(
        req.app.get('db'),
        res.submission.id,
        submissionData
      )
      return res.status(200).json(updatedSubmission)
    } catch (e) {
      next(e)
    }
  })

module.exports = imagesRouter
