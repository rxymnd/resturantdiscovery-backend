
const express = require('express');
const app = express();
const PORT = process.env.PORT;

if (!PORT) {
    console.error("ERROR: PORT is not defined in the environment variables.");
    process.exit(1); // Exit if PORT is not set
    
// Middleware
app.use(express.json());

// Routes
app.post('/api/search', (req, res) => {
    console.log('Search endpoint hit:', req.body); // Log incoming requests
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
    console.log(`Environment variable PORT: ${process.env.PORT}`);
});
