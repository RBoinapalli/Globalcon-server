const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware for parsing JSON bodies
app.use(express.json());

// Configure multer storage for uploading images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/"); // Destination folder for images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage: storage });

let jobs = [
  {
    "_id": 1,
    "img": "network-engineer.jpg",
    "title": "Network Engineer",
    "description": "Expertise in next-generation firewalls, AWS, and Azure environments. Strong communication skills.",
    "skills": [
      "Palo Alto",
      "Zscaler",
      "AWS",
      "Azure",
      "Firewall Policies"
    ],
    "location": "Remote",
    "experience": "5+ years",
    "salary": "$90,000 - $120,000"
  },
  {
    "_id": 2,
    "img": "java-fullStack-dev.png",
    "title": "Java Full Stack Developer",
    "description": "Analyze functional requirements, design microservices architecture, and deploy applications.",
    "skills": [
      "Java",
      "Spring",
      "React",
      "Angular",
      "Microservices"
    ],
    "location": "New York, NY",
    "experience": "3+ years",
    "salary": "$85,000 - $110,000"
  },
  {
    "_id": 3,
    "img": "flutter-dev.png",
    "title": "Flutter Developer",
    "description": "Develop applications using Flutter framework with a focus on payment integration processes.",
    "skills": [
      "Flutter",
      "Dart",
      "iOS",
      "Android",
      "CI/CD"
    ],
    "location": "San Francisco, CA",
    "experience": "2+ years",
    "salary": "$80,000 - $100,000"
  },
  {
    "_id": 4,
    "img": "data-analyst.jpg",
    "title": "Data Analyst",
    "description": "Analyze data using statistical techniques and build machine learning models.",
    "skills": [
      "Python",
      "SQL",
      "Machine Learning",
      "Data Visualization",
      "Mentoring"
    ],
    "location": "Remote",
    "experience": "3+ years",
    "salary": "$75,000 - $95,000"
  },
  {
    "_id": 5,
    "img": "full-stack-dev.jpg",
    "title": "Full Stack Developer",
    "description": "Develop large-scale web applications using React and AWS.",
    "skills": [
      "React",
      "Node.js",
      "AWS",
      "SQL",
      "Version Control"
    ],
    "location": "Austin, TX",
    "experience": "4+ years",
    "salary": "$95,000 - $130,000"
  },
  {
    "_id": 6,
    "img": "database-dev.jpg",
    "title": "Database Developer",
    "description": "Write complex SQL queries and ensure optimal database performance.",
    "skills": [
      "SQL",
      "Data Modeling",
      "Performance Tuning",
      "RDBMS"
    ],
    "location": "Remote",
    "experience": "5+ years",
    "salary": "$85,000 - $115,000"
  },
  {
    "_id": 7,
    "img": "cubersecurity.png",
    "title": "Cyber Security Specialist",
    "description": "Handle security compliance and IAM services in a hybrid cloud environment.",
    "skills": [
      "ISO 27001",
      "IAM",
      "Hybrid Cloud",
      "Compliance"
    ],
    "location": "Remote",
    "experience": "6+ years",
    "salary": "$100,000 - $140,000"
  },
  {
    "_id": 8,
    "img": "android-dev.png",
    "title": "Android Developer",
    "description": "Design and build mobile applications with payment integration.",
    "skills": [
      "Android",
      "Java",
      "RDBMS",
      "AI/ML"
    ],
    "location": "Los Angeles, CA",
    "experience": "3+ years",
    "salary": "$90,000 - $120,000"
  }
];

// GET request to fetch all jobs
app.get("/api/jobs_List", (req, res) => {
  res.json(jobs);
});

// POST request to add a new job (with image upload)
app.post("/api/jobs_List", upload.single("img"), (req, res) => {
  try {
    console.log("Received POST request with body:", req.body);

    // Validate incoming data using Joi
    const { error } = jobSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Construct the new job object
    const newJob = {
      _id: jobs.length + 1,
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      experience: req.body.experience,
      location: req.body.location,
      skills: req.body.skills.split(",").map((skill) => skill.trim()), // Split skills into an array
      img: req.file ? req.file.filename : "default-image.jpg", // Use default image if none uploaded
    };

    jobs.push(newJob);
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error in POST /api/jobs_List:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Joi Schema for validation
const jobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  skills: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
  location: Joi.string().required(),
  experience: Joi.string().required(),
  salary: Joi.string().required(),
});


// PUT to edit a job
app.put("/api/jobs_List/:id", (req, res) => {
  try {
    console.log("Received PUT request with body:", req.body);

    // Find the job to update
    const job = jobs.find((j) => j._id === parseInt(req.params.id));
    if (!job) return res.status(404).send("Job not found.");

    // Allow skills to be passed as a string or array
    const updatedSchema = jobSchema.keys({
      skills: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
    });

    // Validate the updated job data
    const { error } = updatedSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update job properties
    job.title = req.body.title;
    job.description = req.body.description;
    job.salary = req.body.salary;
    job.experience = req.body.experience;
    job.location = req.body.location;
    job.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : req.body.skills.split(",").map((skill) => skill.trim()); // Handle both array and string formats

    res.json(job);
  } catch (error) {
    console.error("Error in PUT /api/jobs_List/:id:", error);
    res.status(500).send("Internal Server Error");
  }
});


// DELETE a job
app.delete('/api/jobs_List/:id', (req, res) => {
  const jobIndex = jobs.findIndex((j) => j._id === parseInt(req.params.id)); // Use _id
  if (jobIndex === -1) return res.status(404).send('Job not found.');

  jobs.splice(jobIndex, 1);
 res.status(200).send('Job deleted successfully.');
});

// Validate job data
function validateJob(job) {
  return jobSchema.validate(job);
}

// Starting the server on port 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});