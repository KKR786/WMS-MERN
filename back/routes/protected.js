const express = require('express')
const { newDomain, getAllDomains } = require('../controllers/systemController')
const {
  createWorklog,
  allWorklogs,
  getWorklogs,
  getWorklog,
  perMonthWorklogs,
  perDayWorklogs,
  deleteWorklog,
  updateWorklog
} = require('../controllers/worklogController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// middleware
router.use(requireAuth)

router.post('/system/domain', newDomain)
router.get('/system/domains', getAllDomains)

//
router.post('/reports', allWorklogs)

// GET all Worklogs
router.get('/', getWorklogs)

router.get('/day', perDayWorklogs)

router.get('/:user_id', perMonthWorklogs)

//GET a single Worklog
router.get('/unique/:id', getWorklog)

// POST a new Worklog
router.post('/', createWorklog)

// DELETE a Worklog
router.delete('/:id', deleteWorklog)

// UPDATE a Worklog
router.patch('/:id', updateWorklog)


module.exports = router