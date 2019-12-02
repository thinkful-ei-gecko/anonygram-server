const express = require('express')
const usersRouter = express.Router()
const UsersService = require('./users-service')

usersRouter.route('/').post(express.json(), async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const isValid = UsersService.validatePassword(password)

  if (isValid !== null) {
    return res.status(400).json({error: `${isValid}`})
  }
  const usernameIsValid = await UsersService.validateUserName(username)
  const usernameExists = await UsersService.validateNewUser(req.app.get('db'), username)
  if (usernameExists || usernameIsValid !== null) {
    return res.status(400).json({error: 'username is invalid'})
  }
  const hashedPass = await UsersService.hashPass(password)
  const newUser = await UsersService.createNewUser(req.app.get('db'), username, hashedPass)

  return res.send(newUser)
})

module.exports = usersRouter
