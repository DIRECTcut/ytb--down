import express from 'express';
import ytdl from 'ytdl-core';

const router = express.Router();

router.post('/info', express.json(), async (req, res) => {
    const videoID = req.body.videoID
    const isIDValid = ytdl.validateID(videoID)

    if (isIDValid) {
        const response: Promise<ytdl.videoInfo> = await ytdl.getInfo(videoID)
            .then((result: ytdl.videoInfo) => {
                res.json(result.formats);
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
                return err;
            })
    } else {
        res.status(400).json({ error: `No video id found: ${videoID}` })
    }
});

router.post('/title', express.json(), async (req, res) => {
    const videoID = req.body.videoID;
    const isIDValid = ytdl.validateID(videoID);

    if (isIDValid) {
        const videoTitle = (
            await ytdl.getInfo(req.body.videoID)
        ).videoDetails.title;

        res.json(Buffer.from(videoTitle).toString('base64').slice(0, 5));
    } else {
        res.status(400).json({ error: `No video id found: ${videoID}` })
    }
})

router.post('/download', express.json(), async (req, res, next) => {
    const videoTitle = (await ytdl.getInfo(req.body.videoID)).videoDetails.title;

    const stream = ytdl(req.body.videoID, { quality: req.body.quality });

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment');

    stream.pipe(res);

    stream.on('error', (err) => {
        res.removeHeader('Content-Type');
        res.status(400).send({ error: err.message });
        next();
    });
});

export default router;