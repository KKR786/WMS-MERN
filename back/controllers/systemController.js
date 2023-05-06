const Domain = require('../models/domainModel')
const WorkType = require('../models/workTypeModel')
const Holidays = require('../models/holidaysModel')

const getAllDomains = async (req, res) => {
    const domains = await Domain.find().sort({ domain: 1 })
    res.status(200).json(domains)
}

const newDomain = async (req, res) => {
    const { domain_id, domain, agency } = req.body
  
    let emptyFields = []
  
    if(!domain_id) {
      emptyFields.push('domain_id')
    }
    if(!domain) {
      emptyFields.push('domain')
    }
    if(!agency) {
      emptyFields.push('agency')
    }
    if(emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
  
    try {
      const user_id = req.user._id
      const domainList = await Domain.create({ domain_id, domain, agency, user_id })
      res.status(201).json(domainList)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }

  const newWorkType = async(req, res) => {
    const { type } = req.body
    
    if(!type) {
        return res.status(400).json({ error: 'Please fill in all the fields', type})
    }

    try {
        const user_id = req.user._id
        const workType = await WorkType.create({ type, user_id })
        res.status(201).json(workType)
    } catch (error) {
        res.status(400).json({error: error.message})
      }
  }

  const getWorkTypes = async(req, res) => {
    const workTypes = await WorkType.find()
    res.status(200).json(workTypes)
  }

  const setHolidays = async(req, res) => {
    const {date, title} = req.body;
    if(!date || !title) {
        return res.status(400).json({ error: 'Please fill in all the fields' })
    }

    try {
        const user_id = req.user._id
        const holidays = await Holidays.create({ date, title, user_id })
        res.status(200).json(holidays)
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }

  }
  const getHoliDays = async (req, res) => {
    const holidays = await Holidays.find()
    res.status(200).json(holidays)
  }

  module.exports = { newDomain, getAllDomains, newWorkType, getWorkTypes, setHolidays, getHoliDays }