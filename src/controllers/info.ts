import { Request, Response } from 'express';
import ytdl from 'ytdl-core';

export default async (req: Request, res: Response) => {
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
};
