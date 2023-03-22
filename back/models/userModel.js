const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const autoIncrement = require('mongoose-auto-increment')

const Schema = mongoose.Schema
autoIncrement.initialize(mongoose.connection);

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  _id: {
    type: Number,
    unique: true
  }
}, {id: false});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: '_id',
  startAt: 1
});

// Signin
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }
  return user
}

// Signup
userSchema.statics.signup = async function(email, name, role, password) {

  // validation
  if (!email || !name || !role || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, name, role, password: hash })

  return user
}

module.exports = mongoose.model('User', userSchema)