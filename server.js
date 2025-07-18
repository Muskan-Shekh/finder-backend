// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const collegeRoutes = require('./routes/collegeRoutes');
const PORT = 4000;
const axios = require('axios');


app.use(cors());
app.use('/api', collegeRoutes);

const autocompleteRouter = express.Router();

autocompleteRouter.get("/autocomplete", async (req, res) => {
  const { input, lat, lng } = req.query;
  try {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    const response = await axios.get(googleApiUrl, {
      params: {
        input,
        key: 'AIzaSyDB0Xo5sVNSdEfgQkNh14tUV6qc4Nsbu80',
        location: `${lat},${lng}`,
        radius: 50000,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching autocomplete from Google:", err);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

app.use('/api', autocompleteRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
