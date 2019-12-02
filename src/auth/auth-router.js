const express = require('express')
const authRouter = express.Router()
const AuthService = require('./auth-service')
const protectedWithJWT = require('../middleware/token-auth')

authRouter.route('/').post(express.json(), async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const user = await AuthService.getUser(req.app.get('db'), username)
  if (!user) {
    return res.status(400).json({ error: 'invalid username or password' })
  }

  const isValidPassword = await AuthService.validatePassword(
    req.app.get('db'),
    username,
    password
  )
  if (!isValidPassword) {
    return res.status(400).json({ error: 'invalid username or password' })
  }
  return res.status(200).json({
    anonygramAuthToken: `${AuthService.createJWT(username, {
      id: user.id,
      username: username,
    })}`,
  })
})
.put(protectedWithJWT, (req, res) => {
  const sub = req.user.username
  const payload = {
    id: req.user.id,
    username: req.user.username
  }
  return res.send({anonygramAuthToken: AuthService.createJWT(sub, payload)})
})

module.exports = authRouter
