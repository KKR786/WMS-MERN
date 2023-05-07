const mongoose = require('mongoose');
const Schema = mongoose.Schema

const leaveSchema = new Schema({
    leaveDate: {
      type: String,
      required: true,
      unique: true
    },
    leaveTitle: {
      type: String,
      required: true
    },
    user_id: {
      type: Number,
      required: true
    }
  }, { timestamps: true })
  
  module.exports = mongoose.model('Leave', leaveSchema)