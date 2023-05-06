const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('WorkType', workTypeSchema)