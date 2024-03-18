const express = require('express');
const router = express.Router();
const { transcodeVideo, uploadToFirebase } = require('../services/transcodeService');

router.post('/transcode', async (req, res) => {
    const { quality } = req.body;
    const videoFilePath = 'C:/Users/Administrator/Documents/programming/webdev/video-streaming-backend/raya.mp4'; // Path to your high-quality video in Firebase Storage

    try {
        // Transcode video to the selected quality
        const transcodedFilePath = await transcodeVideo(videoFilePath, quality);

        // Upload transcoded video to Firebase Storage
        const transcodedFileDestination = `movies/video_${quality}.mp4`;
        await uploadToFirebase(transcodedFilePath, transcodedFileDestination);

        res.status(200).send('Video transcoded and uploaded successfully');
    } catch (error) {
        console.error('Error transcoding video:', error);
        res.status(500).send('Error transcoding video');
    }
});

module.exports = router;
