const express = require('express');
const app = express();
const transcodeRoute = require('./routes/transcode');

app.use(express.json());
app.use('/', transcodeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
