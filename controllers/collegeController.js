// backend/controllers/collegeController.js
const fs = require('fs');

const getColleges = (req, res) => {
  try {
    const data = fs.readFileSync('colleges.json', 'utf-8');
    const colleges = JSON.parse(data);
    res.json(colleges);
  } catch (err) {
    console.log("hello")
    res.status(500).json({ error: 'Failed to load college data' });
  }
};

module.exports = { getColleges };
