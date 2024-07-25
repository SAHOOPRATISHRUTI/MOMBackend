const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const HOST = '192.168.1.242';
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:4200', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use the CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
// Routes
app.use('/', userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/meeting-plus-updated')
.then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Database connection error:', err);
});

app.listen(port, HOST, () => {
  console.log(`Server running at http://${HOST}:${port}/`);
});

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });