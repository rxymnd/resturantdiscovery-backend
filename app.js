const express = require('express');
const cors = require('cors'); // Import CORS

const app = express();
const PORT = process.env.PORT; // Use the dynamic PORT from the environment variable

// Ensure the PORT variable is defined
if (!PORT) {
    console.error("ERROR: PORT is not defined in the environment variables.");
    process.exit(1);
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.post('/api/search', (req, res) => {
    const { location, cuisine } = req.body;
    res.json({ message: `Searching for ${cuisine} restaurants in ${location}` });
});

app.post('/api/shortlist', (req, res) => {
    res.json({ message: 'Restaurant added to shortlist.' });
});

app.get('/api/shortlist/:user_id', (req, res) => {
    res.json({ shortlist: [] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
