import express from 'express';
import ytdl    from 'ytdl-core';
import bodyParser from 'body-parser';

const router = express.Router();

router.post('/info', bodyParser.json(), async (req, res, next) => {
    const videoID = req.body.videoID

    if (!ytdl.validateID(videoID)) {
        const error = new Error('Invalid video ID')
        res.status(400).json({error: error.toString()});
    } else {
        const videoFormats = await (await ytdl.getInfo(videoID)).formats;
        res.setHeader('Content-type', 'application/json');
        res.send(videoFormats);
    } 
});

router.post('/download', bodyParser.json(), (req, res, next) => {

    const video  = ytdl(req.body.videoID, { quality: req.body.quality });
    const stream = video.pipe(res);

    stream.on('end', () => {
        res.header('Content-Type', 'video/mp4').status(200).end()
        
    })
});

export default router;