const express = require('express')

const {
  createWorklog,
  getWorklogs,
  getWorklog,
  perMonthWorklogs,
  perDayWorklogs,
  deleteWorklog,
  updateWorklog
} = require('../controllers/worklogController')

const { getHoliDays, getAllDomains, getWorkTypes } = require('../controllers/systemController')

const { takeLeave, getLeave } = require('../controllers/userController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// middleware
router.use(requireAuth)

//leave
router.post('/user/leave', takeLeave)
router.get('/user/leaves', getLeave)

//Get systems
router.get('/system/holidays', getHoliDays)
router.get('/system/domains', getAllDomains)
router.get('/system/work_types', getWorkTypes)

// GET all Worklogs
router.get('/worklogs/', getWorklogs)

router.get('/worklogs/day', perDayWorklogs)

router.get('/worklogs/:user_id', perMonthWorklogs)

//GET a single Worklog
router.get('/worklogs/unique/:id', getWorklog)

// POST a new Worklog
router.post('/worklogs/', createWorklog)

// DELETE a Worklog
router.delete('/worklogs/:id', deleteWorklog)

// UPDATE a Worklog
router.patch('/worklogs/:id', updateWorklog)


module.exports = router