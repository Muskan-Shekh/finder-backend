// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const collegeRoutes = require('./routes/collegeRoutes');
const PORT = 4000;

app.use(cors());
app.use('/api', collegeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
