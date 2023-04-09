const Domain = require('../models/domainModel')

const getAllDomains = async (req, res) => {
    const domains = await Domain.find()
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

  module.exports = { newDomain, getAllDomains }