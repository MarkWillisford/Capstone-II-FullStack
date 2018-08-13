var express = require('express');
var path = require('path');

var home_router = express.Router();

home_router.get('/home', function(req, res) {
  res.sendFile('./home.html');
});

module.exports = home_router;