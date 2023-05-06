const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const app = express()
const config = require('./utils/config')
const middlewares = require('./utils/middlewares')
const usersRouter = require('./controllers/users')
const authRouter = require('./controllers/auth')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to Mongo DB')
  })
  .catch(error => {
    console.log('Connection to Mongo DB failed', error)
  })

app.use(express.json())
app.use(cors())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(middlewares.errorHandler)

module.exports = app