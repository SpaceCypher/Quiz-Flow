const express = require('express');
const axios = require('axios');
const cors = require('cors');
const apiRoute = require('./api');
const app = express();
const port = 3000; 

app.use(cors());
app.use(express.json()); 

app.use('/api', apiRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});