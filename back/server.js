require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const publicRoutes = require('./routes/public')
const protectedRoutes = require('./routes/protected')
const userRoutes = require('./routes/user')

// express app
const app = express()

// middleware
app.use(express.json())

app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/users', userRoutes)
app.use('/api', publicRoutes)
app.use('/api/protected', protectedRoutes)



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })