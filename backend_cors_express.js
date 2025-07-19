// Express.js CORS Configuration
// Add this to your Express.js server file

const express = require('express');
const cors = require('cors');
const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Example login endpoint
app.post('/api/auth/login/', (req, res) => {
  const { email, password } = req.body;
  
  // Your authentication logic here
  if (email && password) {
    res.json({
      access: 'mock_jwt_token',
      refresh: 'mock_refresh_token',
      user: {
        id: 1,
        name: 'Test User',
        email: email,
        role: 'admin'
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Example registration endpoints
app.post('/api/auth/admin/register/', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ message: `Admin account created for ${name}` });
});

app.post('/api/auth/doctor/register/', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ message: `Doctor account created for ${name}` });
});

app.post('/api/auth/nurse/register/', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ message: `Nurse account created for ${name}` });
});

// Health check endpoint
app.get('/api/health/', (req, res) => {
  res.json({ status: 'healthy', message: 'HospiTrack API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'HospiTrack API', docs: '/api/docs' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// To install required packages:
// npm install express cors
// npm install -g nodemon (for development)
// 
// To run:
// nodemon server.js
