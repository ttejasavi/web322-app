/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Tejasavi____________________ Student ID: _____174401216_________ Date: _May 29,2023______________
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 
const express = require('express');
const app = express();
const storeService = require('./store-service');

// Serve static files from the public folder
app.use(express.static('public'));

// Redirect root to the about page
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Serve the about.html page
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

// Return all published items
app.get('/shop', (req, res) => {
  storeService.getPublishedItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Return all items
app.get('/items', (req, res) => {
  storeService.getAllItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Return all categories
app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Handle 404 - Page Not Found
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express http server listening on port ${port}`);
});
