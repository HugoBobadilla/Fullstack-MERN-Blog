const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.send({
      error: 'Malformatted ID'
    })
  } else if(error.name === 'ValidationError') {
    return response.send({
      error: error.message
    })
  } else if(error.name === 'JsonWebTokenError') {
    return response.send({
      error: error.message
    })
  }
  next()
}

// middleware to validate token
const verifyToken = (request, response, next) => {
  if(request.headers.authorization === undefined) {
    response.json({
      error: 'Token must be provided'
    })
  }

  const token = request.headers.authorization.split(' ')[1]

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

  if(!decodedToken) {
    response.json({
      error: 'Invalid token'
    })
  }

  request.token = decodedToken
  
  next()
}

module.exports = {
  errorHandler,
  verifyToken
}