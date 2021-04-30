import { Request, Response } from 'express';
import getVideoTitle from '../helpers/getVideoTitle';

export default async (req: Request, res: Response) => {
  const { videoID } = req.body;
  const videoTitle = await getVideoTitle(videoID);

  if (videoTitle) {
    res.json(videoTitle);
  } else {
    res.status(400).json({ error: `No video id found: ${videoID}` });
  }
};
