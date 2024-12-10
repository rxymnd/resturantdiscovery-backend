const express = require('express');
const cors = require('cors'); // Import CORS
const axios = require('axios'); // Import Axios

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic PORT or fallback to 3000
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCoU1PW00tGALeMtQrDym6XjB4HTmWWww8'; // Use your provided API key

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing (restrict for production)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Helper function to fetch Place Details
async function fetchPlaceDetails(placeId) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                fields: 'photo',
                key: GOOGLE_API_KEY,
            },
        });

        const photos = response.data.result.photos || [];
        return photos.map(
            (photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
        );
    } catch (error) {
        console.error(`Failed to fetch details for place_id ${placeId}:`, error.message || error);
        return [];
    }
}

// Google Places API Route
app.post('/api/google-search', async (req, res) => {
    const { location, cuisine } = req.body;

    console.log('Received request with:', { location, cuisine });

    try {
        // Query Google Places API
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: `${cuisine} restaurants in ${location}`,
                key: GOOGLE_API_KEY,
            },
        });

        console.log('Google API raw response:', response.data);

        if (!response.data.results || response.data.results.length === 0) {
            console.log('No results found in Google API response');
            return res.status(404).json({ error: 'No restaurants found' });
        }

        // Fetch additional photos for each place
        const places = await Promise.all(
            response.data.results.map(async (place) => {
                let photos = place.photos
                    ? place.photos.map(
                        (photo) =>
                            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
                    )
                    : [];

                // Fetch more photos using Place Details API if fewer than 9 photos exist
                if (photos.length < 9) {
                    const additionalPhotos = await fetchPlaceDetails(place.place_id);
                    photos = [...photos, ...additionalPhotos].slice(0, 9); // Limit to 9 photos
                }

                return {
                    id: place.place_id,
                    name: place.name,
                    cuisine: cuisine || 'Not specified', // Placeholder since Google doesn't return cuisine
                    address: place.formatted_address,
                    photos: photos.length ? photos : ['https://via.placeholder.com/400x300?text=No+Photo+Available'],
                    ratings: {
                        ambience: (place.rating || 0) + 0.5, // Placeholder for ambience
                        food: (place.rating || 0) + 0.3, // Placeholder for food
                        noise: (place.rating || 0) - 0.2, // Placeholder for noise
                        service: (place.rating || 0) + 0.2, // Placeholder for service
                        value: (place.rating || 0), // Placeholder for value
                    },
                };
            })
        );

        console.log('Formatted places:', places);
        res.json(places);
    } catch (error) {
        console.error('Failed to fetch data from Google Places API:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
