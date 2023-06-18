const express = require('express')

// controller functions
const { loginUser, updateUserProfile, getUsers, getUser } = require('../controllers/userController')

const router = express.Router()

//all users
router.get('/', getUsers)

//specific user
router.get('/unique', getUser)

// update User
router.patch('/profile/:_id', updateUserProfile)

// login route
router.post('/login', loginUser)


module.exports = router