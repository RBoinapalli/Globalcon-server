const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Joi = require('joi');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
const DATABASE_URL = 'mongodb+srv://RBoinapalli:<lXr2Fd7QK4lTFPiz>@global.jbc7j.mongodb.net/';
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Save images in public/images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Mongoose schema and model
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  img: { type: String, required: true }, // Store image path
});
const Job = mongoose.model('Job', jobSchema);

// Joi validation schema
const jobValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  salary: Joi.string().required(),
  experience: Joi.string().required(),
  location: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).required(),
});

// Routes

// GET: Fetch all jobs
app.get('/api/jobs_List', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST: Add a new job
app.post('/api/jobs_List', upload.single('img'), async (req, res) => {
  const { title, description, salary, experience, location, skills } = req.body;

  // Validate data
  const { error } = jobValidationSchema.validate({ title, description, salary, experience, location, skills: JSON.parse(skills) });
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Save job to MongoDB
  try {
    const newJob = new Job({
      title,
      description,
      salary,
      experience,
      location,
      skills: JSON.parse(skills),
      img: req.file ? `/images/${req.file.filename}` : '',
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save job' });
  }
});

// PUT: Edit a job
app.put('/api/jobs_List/:id', upload.single('img'), async (req, res) => {
  const { title, description, salary, experience, location, skills } = req.body;

  // Validate data
  const { error } = jobValidationSchema.validate({ title, description, salary, experience, location, skills: JSON.parse(skills) });
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        salary,
        experience,
        location,
        skills: JSON.parse(skills),
        img: req.file ? `/images/${req.file.filename}` : req.body.img, // Update image only if a new one is uploaded
      },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE: Delete a job
app.delete('/api/jobs_List/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
