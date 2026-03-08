import Leave from '../models/Leave.js'

const createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      return res.status(400).json({ message: 'End date must be after or equal to start date' })
    }

    const leave = await Leave.create({
      userId: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    })

    res.status(201).json(leave)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
    res.json(leaves)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
    res.json(leaves)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('userId', 'name email')
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' })
    }

    leave.status = 'approved'
    await leave.save()

    res.json(leave)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('userId', 'name email')
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' })
    }

    leave.status = 'rejected'
    await leave.save()

    res.json(leave)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
}
