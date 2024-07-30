"use strict";

var express = require('express');

// Create an instance of an Express application
var app = express();

// Define a port for the server to listen on
var port = 3000;

// Define a basic route for the root URL "/"
app.get('/', function (req, res) {
  res.send('Hello, World!');
});

// Start the server and listen on the defined port
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});
