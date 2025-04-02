const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Import knowledge base
const { getResponse } = require('./data.js');

// API endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    const response = getResponse(message);
    res.json({ 
      reply: response.text,
      emotion: response.emotion || 'neutral',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});