const ffmpeg = require('fluent-ffmpeg');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const ffmpegPath = "C:/Program Files/ffmpeg/bin/ffmpeg.exe";
ffmpeg.setFfmpegPath(ffmpegPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'video-streaming-app-59520.appspot.com'
    });
}

const storage = admin.storage();
const bucket = storage.bucket();

async function transcodeVideo(videoPath, outputQuality) {
    let width, height;

    // Calculate width and height based on output quality
    switch (outputQuality) {
        case '360p':
            width = 640;
            height = 360;
            break;
        case '480p':
            width = 854;
            height = 480;
            break;
        case '720p':
            width = 1280;
            height = 720;
            break;
        case '1080p':
            width = 1920;
            height = 1080;
            break;
        default:
            throw new Error('Invalid output quality');
    }

    const outputFileName = `${videoPath}_${outputQuality}.mp4`;
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size(`${width}x${height}`) // Set width and height
            .output(outputFileName)
            .on('end', () => {
                resolve(outputFileName);
            })
            .on('error', (err) => {
                reject(err);
            })
            .run();
    });
}


async function uploadToFirebase(filePath, destinationPath) {
    return bucket.upload(filePath, {
        destination: destinationPath
    });
}

module.exports = { transcodeVideo, uploadToFirebase };
