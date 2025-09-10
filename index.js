// index.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API route (as a Vercel serverless function)
const chatHandler = require('./api/chat');
app.use('/api/chat', chatHandler);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// This is for local testing. Vercel handles this automatically.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
