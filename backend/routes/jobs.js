const express = require("express");
const { body, validationResult } = require("express-validator");
const Job = require("../models/Job");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all jobs (with pagination and filtering)
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: "active" };

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.experience) {
      filter.experience = req.query.experience;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create job (admin only)
router.post(
  "/",
  [
    adminAuth,
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("company")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Company must be at least 2 characters"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("location")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Location is required"),
    body("type")
      .isIn(["full-time", "part-time", "contract", "internship"])
      .withMessage("Invalid job type"),
    body("experience")
      .isIn(["entry", "mid", "senior", "executive"])
      .withMessage("Invalid experience level"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const jobData = {
        ...req.body,
        postedBy: req.user._id,
      };

      const job = new Job(jobData);
      await job.save();

      const populatedJob = await Job.findById(job._id).populate(
        "postedBy",
        "name"
      );
      res.status(201).json(populatedJob);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update job (admin only)
router.put(
  "/:id",
  [
    adminAuth,
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("company")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Company must be at least 2 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("location")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Location is required"),
    body("type")
      .optional()
      .isIn(["full-time", "part-time", "contract", "internship"])
      .withMessage("Invalid job type"),
    body("experience")
      .optional()
      .isIn(["entry", "mid", "senior", "executive"])
      .withMessage("Invalid experience level"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("postedBy", "name");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete job (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
