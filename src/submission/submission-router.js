const express = require('express')
const SubmissionService = require('./submission-service')

const submissionRouter = express.Router()

submissionRouter.get('/', async (req, res, next) => {
  const sort = req.query.sort
  
  if (sort !== 'top' && sort !== 'new') {
    return res.status(400).json({ error: 'Invalid value provided for sort param'})
  }
  const submissions = await SubmissionService.getSubmissionsSorted(req.app.get('db'), sort)
  return res.status(200).json(submissions)
})

module.exports = submissionRouter
