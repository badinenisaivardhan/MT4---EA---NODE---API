const express = require('express');
const router = express.Router();
const db = require('diskdb');
db.connect('./data', ['toopenorders']);
db.connect('./data', ['openorders']);
//GET-ENDPOINTS
//POST-ENDPOINTS

module.exports = router;