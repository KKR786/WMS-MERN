const User = require('../models/userModel')
const Leave = require('../models/leaveModel')
const jwt = require('jsonwebtoken')

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

  const leavedays = await Leave.find({user_id}).sort({createdAt: -1})

  res.status(200).json(leavedays)
}

module.exports = { signupUser, loginUser, getUsers, getUser, takeLeave, getLeave }