const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.static("public"));
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const jobsList = [
    {
        "_id": 1,
        "img": "network-engineer.jpg",
        "title": "Network Engineer",
        "description": "Expertise in next-generation firewalls, AWS, and Azure environments. Strong communication skills.",
        "skills": ["Palo Alto", "Zscaler", "AWS", "Azure", "Firewall Policies"],
        "location": "Remote",
        "experience": "5+ years",
        "salary": "$90,000 - $120,000"
    },
    {
        "_id": 2,
        "img": "java-fullStack-dev.png",
        "title": "Java Full Stack Developer",
        "description": "Analyze functional requirements, design microservices architecture, and deploy applications.",
        "skills": ["Java", "Spring", "React", "Angular", "Microservices"],
        "location": "New York, NY",
        "experience": "3+ years",
        "salary": "$85,000 - $110,000"
    },
    {
        "_id": 3,
        "img": "flutter-dev.png",
        "title": "Flutter Developer",
        "description": "Develop applications using Flutter framework with a focus on payment integration processes.",
        "skills": ["Flutter", "Dart", "iOS", "Android", "CI/CD"],
        "location": "San Francisco, CA",
        "experience": "2+ years",
        "salary": "$80,000 - $100,000"
    },
    {
        "_id": 4,
        "img": "data-analyst.jpg",
        "title": "Data Analyst",
        "description": "Analyze data using statistical techniques and build machine learning models.",
        "skills": ["Python", "SQL", "Machine Learning", "Data Visualization", "Mentoring"],
        "location": "Remote",
        "experience": "3+ years",
        "salary": "$75,000 - $95,000"
    },
    {
        "_id": 5,
        "img": "full-stack-dev.jpg",
        "title": "Full Stack Developer",
        "description": "Develop large-scale web applications using React and AWS.",
        "skills": ["React", "Node.js", "AWS", "SQL", "Version Control"],
        "location": "Austin, TX",
        "experience": "4+ years",
        "salary": "$95,000 - $130,000"
    },
    {
        "_id": 6,
        "img": "database-dev.jpg",
        "title": "Database Developer",
        "description": "Write complex SQL queries and ensure optimal database performance.",
        "skills": ["SQL", "Data Modeling", "Performance Tuning", "RDBMS"],
        "location": "Remote",
        "experience": "5+ years",
        "salary": "$85,000 - $115,000"
    },
    {
        "_id": 7,
        "img": "cubersecurity.png",
        "title": "Cyber Security Specialist",
        "description": "Handle security compliance and IAM services in a hybrid cloud environment.",
        "skills": ["ISO 27001", "IAM", "Hybrid Cloud", "Compliance"],
        "location": "Remote",                      
        "experience": "6+ years",
        "salary": "$100,000 - $140,000"
    },
    {
        "_id": 8,
        "img": "android-dev.png",
        "title": "Android Developer",
        "description": "Design and build mobile applications with payment integration.",
        "skills": ["Android", "Java", "RDBMS", "AI/ML"],
        "location": "Los Angeles, CA",
        "experience": "3+ years",
        "salary": "$90,000 - $120,000"
    }
];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/jobs_List", (req, res) => {
  res.json(jobsList);
});

app.listen(3000, () => {
  console.log("Listening....");
});