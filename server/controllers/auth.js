const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

authRouter.post('/register', async (request, response, next) => {
  try {
    const { firstName, lastName, username, email, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
    
  const validPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if(!(user && validPassword)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // create token
  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET_KEY)

  response
    .status(200)
    .header('auth-token', token)
    .send({ token, username: user.username, name: `${user.firstName} ${user.lastName}` })
})

module.exports = authRouter