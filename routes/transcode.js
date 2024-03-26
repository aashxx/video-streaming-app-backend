const express = require('express');
const router = express.Router();
const { transcodeVideo, uploadToFirebase } = require('../services/transcodeService');

router.post('/transcode', async (req, res) => {
    const { movieURL, title } = req.body;

    try {

        const transcodedVideoURLs = {};
        const qualityOptions = ['360p', '480p', '720p'];

        for(const quality of qualityOptions) {
            const transcodedFilePath = await transcodeVideo(movieURL, quality);
            const transcodedFileDestination = `movies/${title}/${title}_${quality}.mp4`;
            const downloadURL = await uploadToFirebase(transcodedFilePath, transcodedFileDestination);
            transcodedVideoURLs[quality] = downloadURL;
        }

        res.status(200).json(transcodedVideoURLs);

    } catch (error) {
        console.error('Error transcoding and uploading video:', error);
        res.status(500).send('Error transcoding and uploading video');
    }
});

module.exports = router;
