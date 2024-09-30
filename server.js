// Import the express module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware for handling CORS and JSON data
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/iit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User schema (using the 'login' collection)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
}, { collection: 'login' });

const User = mongoose.model('User', userSchema);

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists with the provided username and password
    const user = await User.findOne({ username, password });

    if (user) {
      // If user is found, send success response
      res.json({ success: true });
    } else {
      // If user is not found, send failure response
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    // If any error occurs, send error response
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/signupstudent', (req, res) => {
  console.log('Request Body:', req.body);  // Debugging line
  const { name, dob, gender, contact, email, address, password } = req.body;

  // Simple validation
  if (!name || !dob || !gender || !contact || !email || !address || !password) {
      return res.status(400).send('All fields are required.');
  }

  // Check for existing email
  const existingStudent = students.find(student => student.email === email);
  if (existingStudent) {
      return res.status(400).send('Email already exists.');
  }

  // Save the new student (in-memory)
  students.push({ name, dob, gender, contact, email, address, password });
  console.log('New User Registered:', { name, dob, gender, contact, email, address }); // Debugging line
  res.status(201).send('Sign up successful!');
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
