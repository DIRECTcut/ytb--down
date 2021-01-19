import express    from 'express';
import ytdl       from 'ytdl-core';
import bodyParser from 'body-parser';

const router = express.Router();

router.post('/info', bodyParser.json(), async (req, res, next) => {
    const videoID = req.body.videoID

        try {
            ytdl.getInfo(videoID)
                .then(info => res.json(info.formats));
        } catch (err) {
            res.status(400).send({error: err.message});
            next();
        }
});

router.post('/download', bodyParser.json(), (req, res, next) => {
    const stream  = ytdl(req.body.videoID, { quality: req.body.quality });

    res.setHeader('Content-Type', 'video/mp4');
    stream.pipe(res);

    stream.on('error', (err) => {
        res.removeHeader('Content-Type');
        res.status(400).send({error: err.message});
        next();
    });
});

export default router;