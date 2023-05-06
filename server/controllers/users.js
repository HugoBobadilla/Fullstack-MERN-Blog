const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, publishDate: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    const user = await User.findById(id).populate('blogs', { title: 1, author: 1, publishDate: 1 })
    response.json(user)
  } catch(error) {
    next(error)
  }
})

// usersRouter.post('/', async (request, response, next) => {
//   try {
//     const { firstName, lastName, username, email, password } = request.body

//     const saltRounds = 10
//     const passwordHash = await bcrypt.hash(password, saltRounds)

//     const user = new User({
//       firstName,
//       lastName,
//       username,
//       email,
//       passwordHash
//     })

//     const savedUser = await user.save()
//     response.status(201).json(savedUser)
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = usersRouter