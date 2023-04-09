const express = require('express')
const { requireAuth } = require('../middleware/requireAuth')

// controller functions
const { loginUser, signupUser, getUsers, getUser } = require('../controllers/userController')

const router = express.Router()

//all users
router.get('/', getUsers)

//specific user
router.get('/unique', getUser)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router