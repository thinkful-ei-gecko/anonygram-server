const express = require('express')
const SubmissionService = require('./submission-service')
const { getDistanceFromLatLonInKm } = require('../utils')

const submissionRouter = express.Router()

submissionRouter.get('/', async (req, res, next) => {
  const sort = req.query.sort
  const lat = req.query.lat
  const lon = req.query.lon

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

  // compare a current lat/lon center against all submissions in the database
  // return only those within a 20km radius

  const submissions = await SubmissionService.getSubmissionsSorted(
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
})

module.exports = submissionRouter
