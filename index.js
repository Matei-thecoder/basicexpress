
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define a port for the server to listen on
const port = 3000;

// Define a basic route for the root URL "/"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});