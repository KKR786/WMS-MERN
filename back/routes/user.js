const express = require('express')

// controller functions
const { loginUser, getUsers, getUser } = require('../controllers/userController')

const router = express.Router()

//all users
router.get('/', getUsers)

//specific user
router.get('/unique', getUser)


// login route
router.post('/login', loginUser)


module.exports = router