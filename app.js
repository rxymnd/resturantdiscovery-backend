
const express = require('express');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

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
    console.log(`Environment variable PORT: ${process.env.PORT}`);
});
