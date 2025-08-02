const express = require("express")
const User = require("../models/User")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all users (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.role) {
      filter.role = req.query.role
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments(filter)

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user stats (admin only)
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const jobSeekers = await User.countDocuments({ role: "job_seeker" })
    const admins = await User.countDocuments({ role: "admin" })

    res.json({
      total: totalUsers,
      jobSeekers,
      admins,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
