const mongoose = require('mongoose')

const Schema = mongoose.Schema

const domainSchema = new Schema({
  domain_id: {
    type: Number,
    required: true,
    unique: true
  },
  domain: {
    type: String,
    required: true,
    unique: true
  },
  agency: {
    type: String,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  }
}, { id: false, timestamps: true })

module.exports = mongoose.model('Domain', domainSchema)