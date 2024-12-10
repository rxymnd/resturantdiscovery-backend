const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Import Axios

const app = express();
const PORT = process.env.PORT || 3000;

// Your Yelp API Key
const YELP_API_KEY = 'OuCQZXuhuZrxvImF07rxTilBY0sAIg5HfkDUAQPwRhTXyHNvYl9Z4Jt-dXdv9Vn1rAl8HVzMSCdiiHQL8XsvOHvjZj52RIQL6pllRAOvV5E1d5uUSsUhvWvzoJNXZ3Yx';

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.options('*', cors());
app.use(express.json());

// Routes
app.post('/api/search', async (req, res) => {
    const { location, cuisine } = req.body;

    try {
        const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
            headers: {
                Authorization: `Bearer ${YELP_API_KEY}`
            },
            params: {
                location: location || 'Vancouver, BC', // Default location if not provided
                term: cuisine || 'restaurant', // Default term if not provided
                limit: 10 // Limit the number of results to 10
            }
        });

        // Transform the Yelp data to match your frontend's expected structure
        const restaurants = response.data.businesses.map(business => ({
            id: business.id,
            name: business.name,
            cuisine: business.categories.map(category => category.title).join(', '),
            address: business.location.display_address.join(', '),
            ratings: {
                ambience: Math.random() * 2 + 8, // Mocking specific ratings as Yelp does not provide them
                food: Math.random() * 2 + 8,
                noise: Math.random() * 2 + 8,
                service: Math.random() * 2 + 8,
                value: Math.random() * 2 + 8
            },
            photos: business.photos || [business.image_url]
        }));

        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching data from Yelp:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from Yelp.' });
    }
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
