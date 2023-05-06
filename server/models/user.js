const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    required: true
  },
  lastName: {
    type: String,
    minLength: 3,
    required: true
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  email: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const user = mongoose.model('User', userSchema)

module.exports = user