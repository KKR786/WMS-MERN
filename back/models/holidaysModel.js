const mongoose = require('mongoose')

const Schema = mongoose.Schema

const holidaysSchema = new Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Holidays', holidaysSchema)