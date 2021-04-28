import express from 'express';
import path from 'path';
import ytdl from 'ytdl-core';
import fs from 'fs';
import getVideoTitle from '../helpers/getVideoTitle';

const router = express.Router();

router.post('/info', express.json(), async (req, res) => {
  const { videoID } = req.body;
  const isIDValid = ytdl.validateID(videoID);

  if (isIDValid) {
    ytdl.getInfo(videoID)
      .then((result: ytdl.videoInfo) => {
        res.json(result.formats);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
        return err;
      });
  } else {
    res.status(400).json({ error: `No video id found: ${videoID}` });
  }
});

router.post('/title', express.json(), async (req, res) => {
  const { videoID } = req.body;
  const videoTitle = await getVideoTitle(videoID);

  if (videoTitle) {
    res.json(videoTitle);
  } else {
    res.status(400).json({ error: `No video id found: ${videoID}` });
  }
});

router.post('/download', express.json(), async (req, res, next) => {
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

router.post('/network-stream', express.json(), async (req, res, next) => {
  const VIDS_FOLDER_PATH = path.join('./public', 'vids');

  const fileName = await getVideoTitle(req.body.videoID);
  const filePath = path.join(VIDS_FOLDER_PATH, fileName as string);

  const stream = ytdl(req.body.videoID, { quality: req.body.quality });

  fs.access(VIDS_FOLDER_PATH, (err) => {
    if (err) fs.mkdirSync(VIDS_FOLDER_PATH);

    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    stream.on('error', (streamErr) => {
      res.removeHeader('Content-Type');
      res.status(400).send({ error: streamErr.message });
      next();
    });

    stream.on('finish', () => {
      const networkStreamUrl = `${req.protocol
      }://${
        path.join(req.get('host') as string, 'vids', fileName as string)}`;

      res.json(networkStreamUrl);
    });
  });
});

export default router;
