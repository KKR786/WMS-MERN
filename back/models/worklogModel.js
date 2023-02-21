const mongoose = require('mongoose')

const Schema = mongoose.Schema

const worklogSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  ticketId: {
    type: Number,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  agency: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Worklog', worklogSchema)