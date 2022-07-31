const express = require('express');
const router = express.Router();
const db = require('diskdb');
db.connect('./data', ['PendingOrderQueue']);
db.connect('./data', ['RunningOrderQueue']);
db.connect('./data', ['CloseOrderQueue']);
//GET-ENDPOINTS
//POST-ENDPOINTS

module.exports = router;