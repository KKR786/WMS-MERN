const express = require('express')
const {
  createWorklog,
  getWorklogs,
  getWorklog,
  perDayWorklogs,
  deleteWorklog,
  updateWorklog
} = require('../controllers/worklogController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all Worklog routes
router.use(requireAuth)

// GET all Worklogs
router.get('/', getWorklogs)

router.get('/day', perDayWorklogs)

//GET a single Worklog
router.get('/:id', getWorklog)

// POST a new Worklog
router.post('/', createWorklog)

// DELETE a Worklog
router.delete('/:id', deleteWorklog)

// UPDATE a Worklog
router.patch('/:id', updateWorklog)


module.exports = router