const express = require('express')
const { newDomain, newWorkType, setHolidays } = require('../controllers/systemController')
const { allWorklogs } = require('../controllers/worklogController')
const requireAuth = require('../middleware/requireAuth')
const requireSuperAdmin = require('../middleware/requireSuperAdmin')

const router = express.Router()

// middleware
router.use(requireAuth)
router.use(requireSuperAdmin)

router.post('/system/domain', newDomain)
router.post('/system/work_type', newWorkType)
router.post('/system/holiday', setHolidays)

//
router.post('/reports', allWorklogs)


module.exports = router