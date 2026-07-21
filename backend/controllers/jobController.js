import Job from "../models/jobModel.js";


// CREATE JOB
export const createJob = async (req, res) => {

  try {

    const {
      company,
      role,
      status,
      location,
      salary,
      notes,
    } = req.body;

    const job = await Job.create({

      user: req.user._id,

      company,
      role,
      status,
      location,
      salary,
      notes,

    });

    res.status(201).json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET ALL JOBS
export const getJobs = async (req, res) => {

  try {

    const jobs = await Job.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// @desc    Update job status (For Drag and Drop)
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure the logged-in user matches the job owner
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body, // This will contain the new status
      { returnDocument: 'after' }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
};