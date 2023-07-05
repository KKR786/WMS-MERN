const User = require('../models/userModel')
const Leave = require('../models/leaveModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '30d' })
}

//getUsers
const getUsers = async (req, res) => {
  const users = await User.find()

  res.status(200).json(users)
}

//specific User
const getUser = async (req, res) => {
  const id = req.query
  const user = await User.findOne({_id: id})

  if(!user) {
    return res.status(404).json({message: 'User not found'})
  }
  res.status(200).json({user})
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)
    const name = user.name
    const role = user.role
    const id = user._id
    const joined = new Date(user.createdAt.toString());
    const joiningDate = joined.getFullYear() +
    "-" +
    joined.toLocaleString("en-US", { month: "2-digit" }) +
    "-" +
    joined.toLocaleString("en-US", { day: "2-digit" });
    
    res.status(200).json({email, token, name, role, id, joiningDate})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, name, role, password} = req.body

  try {
    const user = await User.signup(email, name, role, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token, name, role})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// update user profile
const updateUserProfile = async (req, res) => {
  const id  = req.params._id;

  if (isNaN(id)) {
    return res.status(404).json({error: 'User Not Found'})
  }

  const updatedUser = await User.findOneAndUpdate({_id: id}, { ...req.body }, { new: true });

  if (!updatedUser) {
    return res.status(400).json({error: 'No User Found'})
  }
  else {
    return res.status(200).json(updatedUser)
  }
}

// update user password
const updateUserPassword = async (req, res) => {
  const id = req.params._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (isNaN(id)) {
    return res.status(404).json({ error: `User${id} Not Found` });
  }

  const user = await User.findById({ _id: id });

  if (!user) {
    return res.status(404).json({ error: 'User Not Found' });
  }

  const match = await bcrypt.compare(oldPassword, user.password);

  if (match) {
    if (newPassword === confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      const updatedPassword = await User.findByIdAndUpdate({_id: id}, { password: hash });

      if (!updatedPassword) {
        return res.status(400).json({ error: 'Password update failed' });
      } else {
        return res.status(200).json(updatedPassword);
      }
    } else {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
  } else {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
};


// Leave
const takeLeave = async (req, res) => {
  const { leaveDate, leaveTitle } = req.body;

  if(!leaveDate || !leaveTitle) {
    return res.status(400).json({ error: 'Please fill in all the fields' })
  }

  try {
    const user_id = req.user._id
    const leaveday = await Leave.create({ leaveDate, leaveTitle, user_id })
    res.status(200).json(leaveday)
  } catch (err) {
    return res.status(400).json({error: err.message})
  }
}
const getLeave = async (req, res) => {
  const user_id = req.user._id

  const leavedays = await Leave.find({user_id}).sort({leaveDate: -1})

  res.status(200).json(leavedays)
}
const todaysOnLeave = async (req, res) => {
  const date = req.query.date;

  const usersOnLeave = await Leave.find({leaveDate: date})

  res.status(200).json(usersOnLeave)
}

module.exports = { signupUser, loginUser, updateUserProfile, updateUserPassword, getUsers, getUser, takeLeave, getLeave, todaysOnLeave }