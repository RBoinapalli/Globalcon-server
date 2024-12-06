const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const Joi = require("joi");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// MongoDB Connection
const DATABASE_URL = "mongodb+srv://RBoinapalli:<lXr2Fd7QK4lTFPiz>@global.jbc7j.mongodb.net"; // Replace with your MongoDB URI
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Mongoose Schema and Model
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  img: { type: String, default: "default-image.jpg" }, // Default image if none uploaded
});

const Job = mongoose.model("Job", jobSchema);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Joi Schema for validation
const validateJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  salary: Joi.string().required(),
  experience: Joi.string().required(),
  location: Joi.string().required(),
  skills: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
});

// CRUD Routes

// GET all jobs
app.get("/api/jobs_List", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST a new job
app.post("/api/jobs_List", upload.single("img"), async (req, res) => {
  try {
    const { error } = validateJobSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newJob = new Job({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      experience: req.body.experience,
      location: req.body.location,
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(",").map((skill) => skill.trim()),
      img: req.file ? req.file.filename : "default-image.jpg",
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT to update a job
app.put("/api/jobs_List/:id", async (req, res) => {
  try {
    const { error } = validateJobSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        salary: req.body.salary,
        experience: req.body.experience,
        location: req.body.location,
        skills: Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(",").map((skill) => skill.trim()),
      },
      { new: true } // Return updated job
    );

    if (!updatedJob) return res.status(404).send("Job not found.");
    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE a job
app.delete("/api/jobs_List/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).send("Job not found.");
    res.status(200).send("Job deleted successfully.");
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
