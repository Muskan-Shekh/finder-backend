// backend/routes/collegeRoutes.js
const express = require('express');
const router = express.Router();
const { getColleges } = require('../controllers/collegeController');

// GET /api/colleges
router.get('/colleges', getColleges);

module.exports = router;
