const express = require("express")
const { body, validationResult } = require("express-validator")
const Application = require("../models/Application")
const Job = require("../models/Job")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Apply for a job
router.post(
  "/",
  [
    auth,
    body("jobId").isMongoId().withMessage("Invalid job ID"),
    body("resume").trim().isLength({ min: 10 }).withMessage("Resume must be at least 10 characters"),
    body("coverLetter").trim().isLength({ min: 10 }).withMessage("Cover letter must be at least 10 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { jobId, resume, coverLetter } = req.body

      // Check if job exists and is active
      const job = await Job.findById(jobId)
      if (!job || job.status !== "active") {
        return res.status(404).json({ message: "Job not found or not active" })
      }

      // Check if user already applied
      const existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      })

      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this job" })
      }

      // Create application
      const application = new Application({
        job: jobId,
        applicant: req.user._id,
        resume,
        coverLetter,
      })

      await application.save()

      const populatedApplication = await Application.findById(application._id)
        .populate("job", "title company")
        .populate("applicant", "name email")

      res.status(201).json(populatedApplication)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's applications
router.get("/my-applications", auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all applications (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) {
      filter.status = req.query.status
    }
    if (req.query.jobId) {
      filter.job = req.query.jobId
    }

    const applications = await Application.find(filter)
      .populate("job", "title company")
      .populate("applicant", "name email phone location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Application.countDocuments(filter)

    res.json({
      applications,
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

// Get applications for a specific job (admin only)
router.get("/job/:jobId", adminAuth, async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email phone location skills experience")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update application status (admin only)
router.put(
  "/:id/status",
  [
    adminAuth,
    body("status").isIn(["pending", "reviewed", "shortlisted", "rejected", "hired"]).withMessage("Invalid status"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { status, notes } = req.body

      const application = await Application.findByIdAndUpdate(req.params.id, { status, notes }, { new: true })
        .populate("job", "title company")
        .populate("applicant", "name email")

      if (!application) {
        return res.status(404).json({ message: "Application not found" })
      }

      res.json(application)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
