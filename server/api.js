const express = require('express');
const axios = require('axios');

const router = express.Router();

 const API_URL = 'https://api.jsonserve.com/Uw5CrX';

router.get('/quiz', async (req, res) => {
    try {
        // Makes a GET request to the external API
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
                 // Logs an error to the console if API request fails

         console.error("Error fetching quiz data:", error);
         res.status(500).json({ error: 'Error fetching quiz data from external API' });
    }
});

module.exports = router;