const blogsRouter = require('express').Router()
const { response, request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const middlewares = require('../utils/middlewares')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { firstName: 1, lastName: 1, email: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params
  
  try {
    const blog = await Blog.findById(id).populate('user', { firstName: 1, lastName: 1, email: 1 })
    response.json(blog)
    
  } catch(error) {
    next(error)
  }
})

blogsRouter.post('/', middlewares.verifyToken, async (request, response, next) => {
  try {
    const body = request.body
    
    const user = await User.findById(request.token.id)

    const newBlog = new Blog({
      title: body.title,
      content: body.content,
      author: `${user.firstName} ${user.lastName}`,
      publishDate: new Date(),
      user: user._id
    })
   
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', middlewares.verifyToken, async (request, response, next) => {
  try {
    const { id } = request.params
    const body = request.body

    const blog = await Blog.findById(id)
    const user = await User.findById(request.token.id)

    if(user.id.toString() === blog.user.toString()) {
        const blogUpdate = {
        title: body.title,
        content: body.content,
        author: blog.author,
        publishDate: blog.publishDate,
        user: blog.user
      }
      
      const updatedBlog = await Blog.findByIdAndUpdate(id, blogUpdate, { new: true })
      response.json(updatedBlog)
    } else {
      response.status(400).json({
        error: 'Not authorized'
      })
    }

    
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middlewares.verifyToken, async (request, response, next) => {
  try {
    const { id } = request.params

    const blog = await Blog.findById(id)
    const user = await User.findById(request.token.id)

    if(user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(blog.id)
      response.status(204).end()
    } else {
      response.status(400).json({
        error: 'Not authorized'
      })
    }

  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter