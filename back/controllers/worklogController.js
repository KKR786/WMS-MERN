const Worklog = require('../models/worklogModel')
const mongoose = require('mongoose')

// get all Worklogs
const getWorklogs = async (req, res) => {
  const user_id = req.user._id

  const Worklogs = await Worklog.find({user_id}).sort({createdAt: -1})

  res.status(200).json(Worklogs)
}

//get per day worklogs
const perDayWorklogs = async (req, res) => {
  const date = req.body;
  
  const dayLogs = await Worklog.find( date );
                  
  if(!dayLogs) {
    return res.json({message: 'No worklogs found'})
  }
  res.status(200).json(dayLogs);
}
//get per month worklogs
const perMonthWorklogs = async (req, res) => {
  const { user_id } = req.params;
  const { month, year } = req.query;

  const startDate = new Date(year, month - 1, 1).toISOString().substr(0, 10);
  const endDate = new Date(year, month, 1, 0, 0, -1).toISOString().substr(0, 10);

  const monthLogs = await Worklog.find({ 
    user_id: user_id,
    date: { $gte: startDate, $lte: endDate } 
  });

  if (!monthLogs || monthLogs.length === 0) {
    return res.json({ error: 'No such Worklog' });
  }

  res.status(200).json(monthLogs);
};

// get a single Worklog
const getWorklog = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Worklog'})
  }

  const worklog = await Worklog.findById({_id: id})

  if (!worklog) {
    return res.status(404).json({error: 'No such Worklog'})
  }
  
  res.status(200).json(worklog)
}


// create new Worklog
const createWorklog = async (req, res) => {
  const { date, ticketId, domain, agency, time, type } = req.body

  let emptyFields = []

  if(!date) {
    emptyFields.push('date')
  }
  if(!ticketId) {
    emptyFields.push('ticketId')
  }
  if(!domain) {
    emptyFields.push('domain')
  }
  if(!agency) {
    emptyFields.push('agency')
  }
  if(!time) {
    emptyFields.push('time')
  }
  if(!type) {
    emptyFields.push('type')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const worklog = await Worklog.create({ date, ticketId, domain, agency, time, type, user_id })
    res.status(201).json(worklog)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a Worklog
const deleteWorklog = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Worklog'})
  }

  const deleteWorklog = await Worklog.findOneAndDelete({_id: id})

  if (!deleteWorklog) {
    return res.status(400).json({error: 'No such Worklog'})
  }

  res.status(200).json(deleteWorklog)
}

// update a Worklog
const updateWorklog = async (req, res) => {
  const { id } = req.params


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Worklog'})
  }

  const updatedWorklog = await Worklog.findOneAndUpdate({_id: id}, { ...req.body }, { new: true });

  if (!updatedWorklog) {
    return res.status(400).json({error: 'No such Worklog'})
  }
  else {
    return res.status(200).json(updatedWorklog)
  }
}


module.exports = {
  getWorklogs,
  getWorklog,
  perMonthWorklogs,
  perDayWorklogs,
  createWorklog,
  deleteWorklog,
  updateWorklog
}